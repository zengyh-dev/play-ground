# Install script for directory: /Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf

# Set the install prefix
if(NOT DEFINED CMAKE_INSTALL_PREFIX)
  set(CMAKE_INSTALL_PREFIX "/usr/local")
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

# Set default install directory permissions.
if(NOT DEFINED CMAKE_OBJDUMP)
  set(CMAKE_OBJDUMP "/Library/Developer/CommandLineTools/usr/bin/objdump")
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Unspecified" OR NOT CMAKE_INSTALL_COMPONENT)
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib" TYPE STATIC_LIBRARY FILES "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/build/ext_build/openexr/OpenEXR/IlmImf/libIlmImf.a")
  if(EXISTS "$ENV{DESTDIR}${CMAKE_INSTALL_PREFIX}/lib/libIlmImf.a" AND
     NOT IS_SYMLINK "$ENV{DESTDIR}${CMAKE_INSTALL_PREFIX}/lib/libIlmImf.a")
    execute_process(COMMAND "/Library/Developer/CommandLineTools/usr/bin/ranlib" "$ENV{DESTDIR}${CMAKE_INSTALL_PREFIX}/lib/libIlmImf.a")
  endif()
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Unspecified" OR NOT CMAKE_INSTALL_COMPONENT)
  include("/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/build/ext_build/openexr/OpenEXR/IlmImf/CMakeFiles/IlmImf.dir/install-cxx-module-bmi-Release.cmake" OPTIONAL)
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Unspecified" OR NOT CMAKE_INSTALL_COMPONENT)
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/include/OpenEXR" TYPE FILE FILES
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfForward.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfExport.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfAttribute.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfBoxAttribute.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfCRgbaFile.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfChannelList.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfChannelListAttribute.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfCompressionAttribute.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfDoubleAttribute.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfFloatAttribute.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfFrameBuffer.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfHeader.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfIO.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfInputFile.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfIntAttribute.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfLineOrderAttribute.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfMatrixAttribute.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfOpaqueAttribute.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfOutputFile.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfRgbaFile.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfStringAttribute.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfVecAttribute.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfHuf.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfWav.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfLut.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfArray.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfCompression.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfLineOrder.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfName.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfPixelType.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfVersion.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfXdr.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfConvert.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfPreviewImage.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfPreviewImageAttribute.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfChromaticities.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfChromaticitiesAttribute.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfKeyCode.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfKeyCodeAttribute.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfTimeCode.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfTimeCodeAttribute.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfRational.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfRationalAttribute.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfFramesPerSecond.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfStandardAttributes.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfEnvmap.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfEnvmapAttribute.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfInt64.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfRgba.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfTileDescription.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfTileDescriptionAttribute.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfTiledInputFile.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfTiledOutputFile.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfTiledRgbaFile.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfRgbaYca.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfTestFile.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfThreading.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfB44Compressor.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfStringVectorAttribute.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfMultiView.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfAcesFile.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfMultiPartOutputFile.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfGenericOutputFile.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfMultiPartInputFile.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfGenericInputFile.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfPartType.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfPartHelper.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfOutputPart.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfTiledOutputPart.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfInputPart.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfTiledInputPart.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfDeepScanLineOutputFile.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfDeepScanLineOutputPart.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfDeepScanLineInputFile.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfDeepScanLineInputPart.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfDeepTiledInputFile.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfDeepTiledInputPart.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfDeepTiledOutputFile.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfDeepTiledOutputPart.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfDeepFrameBuffer.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfDeepCompositing.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfCompositeDeepScanLine.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfNamespace.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfMisc.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfDeepImageState.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfDeepImageStateAttribute.h"
    "/Users/zengyihao/work/learn/play-ground/packages/graphics/src/games202/HomeWork2/prt/ext/openexr/OpenEXR/IlmImf/ImfFloatVectorAttribute.h"
    )
endif()

