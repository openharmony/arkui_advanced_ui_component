/*
 * Copyright (c) 2025 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

#include "napi/native_node_api.h"
#include "hilog/log.h"

#ifdef WINDOW_MANAGER_ENABLE
#include "refbase.h"
#include "iremote_object.h"
#include "window.h"
#include <optional>
#endif

static constexpr int HALF_SCREEN_DOMAIN = 0x5fdd;
static constexpr char HALF_SCREEN_TAG[] = "WindowAdapter";
static constexpr OHOS::HiviewDFX::HiLogLabel HALF_SCREEN_LABEL = { LOG_APP, HALF_SCREEN_DOMAIN, HALF_SCREEN_TAG };

#define NATIVE_DEBUG(...) (void)OHOS::HiviewDFX::HiLog::Debug(HALF_SCREEN_LABEL, ##__VA_ARGS__)
#define NATIVE_ERROR(...) (void)OHOS::HiviewDFX::HiLog::Error(HALF_SCREEN_LABEL, ##__VA_ARGS__)

static napi_value SetStatusBarColor(napi_env env, napi_callback_info info)
{
    size_t requireArgc = 2;
    size_t argc = 2;
    napi_value args[2] = { nullptr };
    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, args, nullptr, nullptr));
    NAPI_ASSERT(env, argc >= requireArgc, "Wrong number of arguments");

    napi_valuetype windowIdType;
    napi_valuetype colorType;
    NAPI_CALL(env, napi_typeof(env, args[0], &windowIdType));
    NAPI_ASSERT(env, windowIdType == napi_number, "Param windowId is invalid. Number expected.");
    NAPI_CALL(env, napi_typeof(env, args[1], &colorType));
    NAPI_ASSERT(env, colorType == napi_number, "Param color is invalid. Number expected.");

    int windowId = -1;
    uint32_t color = 0;
    NAPI_CALL(env, napi_get_value_int32(env, args[0], &windowId));
    NAPI_CALL(env, napi_get_value_uint32(env, args[1], &color));
    
    NATIVE_DEBUG("SetStatusBarColor windowId: %{public}d, color: %{public}u", windowId, color);
#ifdef WINDOW_MANAGER_ENABLE
    auto window = OHOS::Rosen::Window::GetWindowWithId(windowId);
    if (!window) {
        NATIVE_ERROR("SetStatusBarColor window is nullptr");
        return nullptr;
    }
    std::optional<uint32_t> contentColor { color };
    window->SetStatusBarColorForPage(contentColor);
#else
    NATIVE_ERROR("SetStatusBarColor is not support");
#endif
    return nullptr;
}

static napi_value ClearStatusBarColor(napi_env env, napi_callback_info info)
{
    size_t requireArgc = 1;
    size_t argc = 1;
    napi_value args[1] = { nullptr };
    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, args, nullptr, nullptr));
    NAPI_ASSERT(env, argc >= requireArgc, "Wrong number of arguments");

    napi_valuetype windowIdType;
    NAPI_CALL(env, napi_typeof(env, args[0], &windowIdType));
    NAPI_ASSERT(env, windowIdType == napi_number, "Param windowId is invalid. Number expected.");
    
    int windowId = -1;
    NAPI_CALL(env, napi_get_value_int32(env, args[0], &windowId));
    
    NATIVE_DEBUG("ClearStatusBarColor windowId: %{public}d", windowId);
#ifdef WINDOW_MANAGER_ENABLE
    auto window = OHOS::Rosen::Window::GetWindowWithId(windowId);
    if (!window) {
        NATIVE_ERROR("ClearStatusBarColor window is nullptr");
        return nullptr;
    }
    window->SetStatusBarColorForPage(std::nullopt);
#else
    NATIVE_ERROR("ClearStatusBarColor is not support");
#endif
    return nullptr;
}

static napi_value Init(napi_env env, napi_value exports)
{
    napi_property_descriptor desc[] = {
        DECLARE_NAPI_FUNCTION("setStatusBarColor", SetStatusBarColor),
        DECLARE_NAPI_FUNCTION("clearStatusBarColor", ClearStatusBarColor)
    };
    NAPI_CALL(env, napi_define_properties(env, exports, sizeof(desc) / sizeof(desc[0]), desc));
    return exports;
}

extern const char _binary_halfscreenlaunchcomponent_abc_start[];
extern const char _binary_halfscreenlaunchcomponent_abc_end[];

// Napi get abc code function
extern "C" __attribute__((visibility("default"))) void NAPI_atomicservice_HalfScreenLaunchComponent_GetABCCode(
    const char** buf, int* buflen)
{
    if (buf != nullptr) {
        *buf = _binary_halfscreenlaunchcomponent_abc_start;
    }
    if (buflen != nullptr) {
        *buflen = _binary_halfscreenlaunchcomponent_abc_end -
            _binary_halfscreenlaunchcomponent_abc_start;
    }
}

/*
 * Module define
 */
static napi_module HalfScreenLaunchComponentModule = {
    .nm_version = 1,
    .nm_flags = 0,
    .nm_filename = nullptr,
    .nm_register_func = Init,
    .nm_modname = "atomicservice.HalfScreenLaunchComponent",
    .nm_priv = ((void*)0),
    .reserved = { 0 },
};

/*
 * Module registerfunction
 */
extern "C" __attribute__((constructor)) void HalfScreenLaunchComponentRegisterModule(void)
{
    napi_module_register(&HalfScreenLaunchComponentModule);
}
