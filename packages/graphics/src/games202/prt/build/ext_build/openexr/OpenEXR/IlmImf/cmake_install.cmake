# Install script for directory: E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf

# Set the install prefix
if(NOT DEFINED CMAKE_INSTALL_PREFIX)
  set(CMAKE_INSTALL_PREFIX "C:/Program Files/nori")
endif()
string(REGEX REPLACE "/$" "" CMAKE_INSTALL_PREFIX "${CMAKE_INSTALL_PREFIX}")

# Set the install configuration name.
if(NOT DEFINED CMAKE_INSTALL_CONFIG_NAME)
  if(BUILD_TYPE)
    string(REGEX REPLACE "^[^A-Za-z0-9_]+" ""
           CMAKE_INSTALL_CONFIG_NAME "${BUILD_TYPE}")
  else()
    set(CMAKE_INSTALL_CONFIG_NAME "Release")
  endif()
  message(STATUS "Install configuration: \"${CMAKE_INSTALL_CONFIG_NAME}\"")
endif()

# Set the component getting installed.
if(NOT CMAKE_INSTALL_COMPONENT)
  if(COMPONENT)
    message(STATUS "Install component: \"${COMPONENT}\"")
    set(CMAKE_INSTALL_COMPONENT "${COMPONENT}")
  else()
    set(CMAKE_INSTALL_COMPONENT)
  endif()
endif()

# Is this installation the result of a crosscompile?
if(NOT DEFINED CMAKE_CROSSCOMPILING)
  set(CMAKE_CROSSCOMPILING "FALSE")
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Unspecified" OR NOT CMAKE_INSTALL_COMPONENT)
  if(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Dd][Ee][Bb][Uu][Gg])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib" TYPE STATIC_LIBRARY FILES "E:/Learn/play-ground/packages/graphics/src/games202/prt/build/ext_build/openexr/OpenEXR/IlmImf/Debug/IlmImf.lib")
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Rr][Ee][Ll][Ee][Aa][Ss][Ee])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib" TYPE STATIC_LIBRARY FILES "E:/Learn/play-ground/packages/graphics/src/games202/prt/build/ext_build/openexr/OpenEXR/IlmImf/Release/IlmImf.lib")
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Mm][Ii][Nn][Ss][Ii][Zz][Ee][Rr][Ee][Ll])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib" TYPE STATIC_LIBRARY FILES "E:/Learn/play-ground/packages/graphics/src/games202/prt/build/ext_build/openexr/OpenEXR/IlmImf/MinSizeRel/IlmImf.lib")
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Rr][Ee][Ll][Ww][Ii][Tt][Hh][Dd][Ee][Bb][Ii][Nn][Ff][Oo])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib" TYPE STATIC_LIBRARY FILES "E:/Learn/play-ground/packages/graphics/src/games202/prt/build/ext_build/openexr/OpenEXR/IlmImf/RelWithDebInfo/IlmImf.lib")
  endif()
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Unspecified" OR NOT CMAKE_INSTALL_COMPONENT)
  if(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Dd][Ee][Bb][Uu][Gg])$")
    include("E:/Learn/play-ground/packages/graphics/src/games202/prt/build/ext_build/openexr/OpenEXR/IlmImf/CMakeFiles/IlmImf.dir/install-cxx-module-bmi-Debug.cmake" OPTIONAL)
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Rr][Ee][Ll][Ee][Aa][Ss][Ee])$")
    include("E:/Learn/play-ground/packages/graphics/src/games202/prt/build/ext_build/openexr/OpenEXR/IlmImf/CMakeFiles/IlmImf.dir/install-cxx-module-bmi-Release.cmake" OPTIONAL)
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Mm][Ii][Nn][Ss][Ii][Zz][Ee][Rr][Ee][Ll])$")
    include("E:/Learn/play-ground/packages/graphics/src/games202/prt/build/ext_build/openexr/OpenEXR/IlmImf/CMakeFiles/IlmImf.dir/install-cxx-module-bmi-MinSizeRel.cmake" OPTIONAL)
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Rr][Ee][Ll][Ww][Ii][Tt][Hh][Dd][Ee][Bb][Ii][Nn][Ff][Oo])$")
    include("E:/Learn/play-ground/packages/graphics/src/games202/prt/build/ext_build/openexr/OpenEXR/IlmImf/CMakeFiles/IlmImf.dir/install-cxx-module-bmi-RelWithDebInfo.cmake" OPTIONAL)
  endif()
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Unspecified" OR NOT CMAKE_INSTALL_COMPONENT)
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/include/OpenEXR" TYPE FILE FILES
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfForward.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfExport.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfAttribute.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfBoxAttribute.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfCRgbaFile.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfChannelList.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfChannelListAttribute.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfCompressionAttribute.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfDoubleAttribute.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfFloatAttribute.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfFrameBuffer.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfHeader.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfIO.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfInputFile.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfIntAttribute.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfLineOrderAttribute.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfMatrixAttribute.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfOpaqueAttribute.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfOutputFile.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfRgbaFile.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfStringAttribute.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfVecAttribute.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfHuf.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfWav.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfLut.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfArray.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfCompression.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfLineOrder.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfName.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfPixelType.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfVersion.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfXdr.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfConvert.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfPreviewImage.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfPreviewImageAttribute.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfChromaticities.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfChromaticitiesAttribute.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfKeyCode.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfKeyCodeAttribute.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfTimeCode.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfTimeCodeAttribute.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfRational.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfRationalAttribute.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfFramesPerSecond.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfStandardAttributes.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfEnvmap.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfEnvmapAttribute.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfInt64.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfRgba.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfTileDescription.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfTileDescriptionAttribute.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfTiledInputFile.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfTiledOutputFile.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfTiledRgbaFile.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfRgbaYca.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfTestFile.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfThreading.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfB44Compressor.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfStringVectorAttribute.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfMultiView.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfAcesFile.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfMultiPartOutputFile.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfGenericOutputFile.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfMultiPartInputFile.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfGenericInputFile.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfPartType.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfPartHelper.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfOutputPart.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfTiledOutputPart.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfInputPart.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfTiledInputPart.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfDeepScanLineOutputFile.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfDeepScanLineOutputPart.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfDeepScanLineInputFile.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfDeepScanLineInputPart.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfDeepTiledInputFile.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfDeepTiledInputPart.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfDeepTiledOutputFile.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfDeepTiledOutputPart.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfDeepFrameBuffer.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfDeepCompositing.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfCompositeDeepScanLine.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfNamespace.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfMisc.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfDeepImageState.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfDeepImageStateAttribute.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/OpenEXR/IlmImf/ImfFloatVectorAttribute.h"
    )
endif()

