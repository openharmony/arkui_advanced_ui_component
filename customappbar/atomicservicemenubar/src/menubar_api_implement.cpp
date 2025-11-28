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
 
#include "native_engine/native_engine.h"
#include "native/native_type.h"
#include "native/native_node.h"
#include "native/native_node_napi.h"
#include "native/native_interface.h"
#include "napi/native_api.h"
#include "napi/native_node_api.h"
#include "include/menubar_api_implement.h"
#include "include/log.h"
 
static constexpr char FILE_TAG[] = "MenubarAPIImplement";
 
namespace OHOS::AtomicServiceMenubar {
/**
 * set visibility of menubar by CAPI which supported by ArkUI
 */
napi_value MenubarAPIImplement::setMenubarVisible(napi_env env, napi_callback_info info)
{
    napi_handle_scope handleScope = nullptr;
    napi_status status = napi_open_handle_scope(env, &handleScope);
    if (status != napi_ok) {
        FLOG_ERR("failed to open handle scope");
        return nullptr;
    }
    napi_value args[2] = {nullptr};
    size_t argc = 2;
    if (napi_get_cb_info(env, info, &argc, args, nullptr, nullptr) != napi_ok) {
        FLOG_ERR("failed to get argc from napi value");
        napi_close_handle_scope(env, handleScope);
        return nullptr;
    }
    bool isMenubarVisible = false;
    if (napi_get_value_bool(env, args[1], &isMenubarVisible) != napi_ok) {
        FLOG_ERR("failed to get bool value from napi value");
        napi_close_handle_scope(env, handleScope);
        return nullptr;
    }
    ArkUI_ContextHandle context = nullptr;
    auto code = OH_ArkUI_GetContextFromNapiValue(env, args[0], &context);
    if (code || !context) {
        FLOG_INFO("fail to get context from napi value, errCode = %{public}d", code);
        napi_close_handle_scope(env, handleScope);
        return nullptr;
    }
    static ArkUI_NativeNodeAPI_1 *nodeAPI = nullptr;
    OH_ArkUI_GetModuleInterface(ARKUI_NATIVE_NODE, ArkUI_NativeNodeAPI_1, nodeAPI);
    code = OH_ArkUI_NativeModule_AtomicServiceMenuBarSetVisible(context, isMenubarVisible);
    if (code || !context) {
        FLOG_INFO("fail to call setVisible, errCode = %{public}d", code);
    }
    status = napi_close_handle_scope(env, handleScope);
    return nullptr;
}
}
