# Install script for directory: E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/IlmBase/Iex

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
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib" TYPE STATIC_LIBRARY FILES "E:/Learn/play-ground/packages/graphics/src/games202/prt/build/ext_build/openexr/IlmBase/Iex/Debug/Iex.lib")
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Rr][Ee][Ll][Ee][Aa][Ss][Ee])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib" TYPE STATIC_LIBRARY FILES "E:/Learn/play-ground/packages/graphics/src/games202/prt/build/ext_build/openexr/IlmBase/Iex/Release/Iex.lib")
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Mm][Ii][Nn][Ss][Ii][Zz][Ee][Rr][Ee][Ll])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib" TYPE STATIC_LIBRARY FILES "E:/Learn/play-ground/packages/graphics/src/games202/prt/build/ext_build/openexr/IlmBase/Iex/MinSizeRel/Iex.lib")
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Rr][Ee][Ll][Ww][Ii][Tt][Hh][Dd][Ee][Bb][Ii][Nn][Ff][Oo])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib" TYPE STATIC_LIBRARY FILES "E:/Learn/play-ground/packages/graphics/src/games202/prt/build/ext_build/openexr/IlmBase/Iex/RelWithDebInfo/Iex.lib")
  endif()
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Unspecified" OR NOT CMAKE_INSTALL_COMPONENT)
  if(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Dd][Ee][Bb][Uu][Gg])$")
    include("E:/Learn/play-ground/packages/graphics/src/games202/prt/build/ext_build/openexr/IlmBase/Iex/CMakeFiles/Iex.dir/install-cxx-module-bmi-Debug.cmake" OPTIONAL)
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Rr][Ee][Ll][Ee][Aa][Ss][Ee])$")
    include("E:/Learn/play-ground/packages/graphics/src/games202/prt/build/ext_build/openexr/IlmBase/Iex/CMakeFiles/Iex.dir/install-cxx-module-bmi-Release.cmake" OPTIONAL)
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Mm][Ii][Nn][Ss][Ii][Zz][Ee][Rr][Ee][Ll])$")
    include("E:/Learn/play-ground/packages/graphics/src/games202/prt/build/ext_build/openexr/IlmBase/Iex/CMakeFiles/Iex.dir/install-cxx-module-bmi-MinSizeRel.cmake" OPTIONAL)
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Rr][Ee][Ll][Ww][Ii][Tt][Hh][Dd][Ee][Bb][Ii][Nn][Ff][Oo])$")
    include("E:/Learn/play-ground/packages/graphics/src/games202/prt/build/ext_build/openexr/IlmBase/Iex/CMakeFiles/Iex.dir/install-cxx-module-bmi-RelWithDebInfo.cmake" OPTIONAL)
  endif()
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Unspecified" OR NOT CMAKE_INSTALL_COMPONENT)
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/include/OpenEXR" TYPE FILE FILES
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/IlmBase/Iex/IexBaseExc.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/IlmBase/Iex/IexMathExc.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/IlmBase/Iex/IexThrowErrnoExc.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/IlmBase/Iex/IexErrnoExc.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/IlmBase/Iex/IexMacros.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/IlmBase/Iex/Iex.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/IlmBase/Iex/IexNamespace.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/IlmBase/Iex/IexExport.h"
    "E:/Learn/play-ground/packages/graphics/src/games202/prt/ext/openexr/IlmBase/Iex/IexForward.h"
    )
endif()
