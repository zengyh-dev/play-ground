#ifdef GL_ES
precision mediump float;
#endif

// Phong related variables
uniform sampler2D uSampler;
uniform vec3 uKd;
uniform vec3 uKs;
uniform vec3 uLightPos;
uniform vec3 uCameraPos;
uniform vec3 uLightIntensity;

varying highp vec2 vTextureCoord;
varying highp vec3 vFragPos;
varying highp vec3 vNormal;

// Shadow map related variables
#define NUM_SAMPLES 100
#define SHADOWMAP_SIZE 2048
#define BLOCKER_SEARCH_NUM_SAMPLES NUM_SAMPLES
#define PCF_NUM_SAMPLES NUM_SAMPLES
#define NUM_RINGS 10

#define EPS 1e-3
#define PI 3.141592653589793
#define PI2 6.283185307179586

#define NEAR_PLANE 0.05
#define LIGHT_WORLD_SIZE 1.0
#define LIGHT_FRUSTUM_WIDTH 1.0
#define LIGHT_SIZE_UV (LIGHT_WORLD_SIZE / LIGHT_FRUSTUM_WIDTH)

uniform sampler2D uShadowMap;

varying vec4 vPositionFromLight;

highp float rand_1to1(highp float x) { 
  // -1 -1
    return fract(sin(x) * 10000.0);
}

highp float rand_2to1(vec2 uv) { 
  // 0 - 1
    const highp float a = 12.9898, b = 78.233, c = 43758.5453;
    highp float dt = dot(uv.xy, vec2(a, b)), sn = mod(dt, PI);
    return fract(sin(sn) * c);
}

float unpack(vec4 rgbaDepth) {
    const vec4 bitShift = vec4(1.0, 1.0 / 256.0, 1.0 / (256.0 * 256.0), 1.0 / (256.0 * 256.0 * 256.0));
    float depth = dot(rgbaDepth, bitShift);
    return depth;
}

vec2 poissonDisk[NUM_SAMPLES];

void poissonDiskSamples(const in vec2 randomSeed) {
    float ANGLE_STEP = PI2 * float(NUM_RINGS) / float(NUM_SAMPLES);
    float INV_NUM_SAMPLES = 1.0 / float(NUM_SAMPLES);

    float angle = rand_2to1(randomSeed) * PI2;
    float radius = INV_NUM_SAMPLES;
    float radiusStep = radius;

    for(int i = 0; i < NUM_SAMPLES; i++) {
        poissonDisk[i] = vec2(cos(angle), sin(angle)) * pow(radius, 0.75);
        radius += radiusStep;
        angle += ANGLE_STEP;
    }
}

void uniformDiskSamples(const in vec2 randomSeed) {
    float randNum = rand_2to1(randomSeed);
    float sampleX = rand_1to1(randNum);
    float sampleY = rand_1to1(sampleX);

    float angle = sampleX * PI2;
    float radius = sqrt(sampleY);

    for(int i = 0; i < NUM_SAMPLES; i++) {
        poissonDisk[i] = vec2(radius * cos(angle), radius * sin(angle));

        sampleX = rand_1to1(sampleY);
        sampleY = rand_1to1(sampleX);

        angle = sampleX * PI2;
        radius = sqrt(sampleY);
    }
}

float useShadowMap(sampler2D shadowMap, vec4 shadowCoord) {
    vec4 rgbaDepth = texture2D(shadowMap, shadowCoord.xy);
    float depth = unpack(rgbaDepth);
    float visibility = (shadowCoord.z > depth) ? 0.3 : 1.0;
    return visibility;
}

float Bias() {
 //解决shadow bias 因为shadow map的精度有限，当要渲染的fragment在light space中距Light很远的时候，就会有多个附近的fragement会samper shadow map中同一个texel,但是即使这些fragment在camera view space中的深度值z随xy变化是值变化是很大的，
  //但他们在light space 中的z值(shadow map中的值)却没变或变化很小，这是因为shadow map分辨率低，采样率低导致精度低，不能准确的记录这些细微的变化

  // calculate bias (based on depth map resolution and slope)  vec3 lightDir = normalize(uLightPos);
    vec3 lightDir = normalize(uLightPos - vFragPos);
    vec3 normal = normalize(vNormal);
    // float m = 200. / 2048. / 2;
    float bias = max(0.05, 0.05 * (1.0 - dot(normal, lightDir))) * 0.01;
    return bias;
}

float PCF(sampler2D shadowMap, vec4 shadowCoord, float filterSize) {
    float bias = Bias();
    float visibility = 0.0;
    float currentDepth = shadowCoord.z;
//  float  filterSize=  1.0 / 2048.0 * 10.0;
    poissonDiskSamples(shadowCoord.xy);
    for(int i = 0; i < NUM_SAMPLES; i++) {
        vec2 texcoords = shadowCoord.xy + poissonDisk[i] * filterSize;
        vec4 rgbaDepth = texture2D(shadowMap, texcoords);
        float closesDepth = unpack(rgbaDepth);
        visibility += closesDepth < currentDepth - bias ? 0.0 : 1.0;
    }

    return visibility / float(NUM_SAMPLES);
}

float findBlocker(sampler2D shadowMap, vec2 uv, float zReceiver) {
    poissonDiskSamples(uv);
    int numBlockers = 0;
    float sumDepth = 0.0;
    // blocker search的大小
    float searchWidth = LIGHT_SIZE_UV * (zReceiver - NEAR_PLANE) / zReceiver;
    for(int i = 0; i < NUM_SAMPLES; i++) {
        vec2 offset = 20.0 / 2048.0 * poissonDisk[i];
        vec4 rgbaDepth = texture2D(shadowMap, uv + offset);
        float depth = unpack(rgbaDepth);

        if(depth + 0.01 >= zReceiver) {
            sumDepth += depth;
            numBlockers++;
        }
    }
    if(numBlockers == 0) {
        return 0.0;
    }
    return sumDepth / float(numBlockers);
}

float PenumbraSize(float zReceiver, float zBlocker) //Parallel plane estimation
{
    return (zReceiver - zBlocker) / zBlocker;
}

// float PCFFilter(sampler2D shadowMap, vec2 uv, float zReceiver, float filterRadiusUV) {
//     float sum = 0.0;
//     for(int i = 0; i < PCF_NUM_SAMPLES; ++i) {
//         vec2 offset = poissonDisk[i] * filterRadiusUV;
//         sum += shadowMap.SampleCmpLevelZero(PCF_Sampler, uv + offset, zReceiver);
//     }
//     return sum / PCF_NUM_SAMPLES;
// }

float PCSS(sampler2D shadowMap, vec4 shadowCoord) {
    float zReceiver = shadowCoord.z;

  // STEP 1: avgblocker depth
    float avgBlockerDepth = findBlocker(shadowMap, shadowCoord.xy, zReceiver);

  // STEP 2: penumbra size
    // float penumbra = bolckerDepth * LIGHT_WIDTH / shadowCoord.z - bolckerDepth;

    float wpenumbra = 1.0 * (shadowCoord.z - avgBlockerDepth) / avgBlockerDepth;
    float penumbraRatio = PenumbraSize(shadowCoord.z, avgBlockerDepth);
    float filterRadiusUV = penumbraRatio * LIGHT_SIZE_UV * NEAR_PLANE;

  // STEP 3: filtering
    float visibility = PCF(shadowMap, shadowCoord, wpenumbra);
    return visibility;
}

vec3 blinnPhong() {
    vec3 color = texture2D(uSampler, vTextureCoord).rgb;
    color = pow(color, vec3(2.2));

    vec3 ambient = 0.05 * color;

    vec3 lightDir = normalize(uLightPos);
    vec3 normal = normalize(vNormal);
    float diff = max(dot(lightDir, normal), 0.0);
    vec3 light_atten_coff = uLightIntensity / pow(length(uLightPos - vFragPos), 2.0);
    vec3 diffuse = diff * light_atten_coff * color;

    vec3 viewDir = normalize(uCameraPos - vFragPos);
    vec3 halfDir = normalize((lightDir + viewDir));
    float spec = pow(max(dot(halfDir, normal), 0.0), 32.0);
    vec3 specular = uKs * light_atten_coff * spec;

    vec3 radiance = (ambient + diffuse + specular);
    vec3 phongColor = pow(radiance, vec3(1.0 / 2.2));
    return phongColor;
}

void main(void) {

    float visibility;
    // 首先齐次除法，除w归一化[-1, 1]，转换到了NDC空间
    // 然后除2，范围范围[-0.5, 0.5]
    // 加上0.5，范围就是[0, 1]
    // 注意，这里的vPositionFromLight已经是光源看向当前点的坐标（经过了光源mvp）
    vec3 shadowCoord = (vPositionFromLight.xyz / vPositionFromLight.w) / 2.0 + 0.5;

    // visibility = useShadowMap(uShadowMap, vec4(shadowCoord, 1.0));

    float Stride = 100.0;
    float filterSize = Stride / float(SHADOWMAP_SIZE * 10);
    // visibility = PCF(uShadowMap, vec4(shadowCoord, 1.0), filterSize);
    visibility = PCSS(uShadowMap, vec4(shadowCoord, 1.0));

    vec3 phongColor = blinnPhong();

    gl_FragColor = vec4(phongColor * visibility, 1.0);
    // gl_FragColor = vec4(phongColor, 1.0);
}