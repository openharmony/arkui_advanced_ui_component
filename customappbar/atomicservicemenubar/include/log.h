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
 
#ifndef MENUBARNATIVE_LOG_H
#define MENUBARNATIVE_LOG_H
 
#include <hilog/log.h>
 
static constexpr int NATIVE_DOMAIN = 0x5fdd;
static constexpr char NATIVE_TAG[] = "menubar-native";
static constexpr OHOS::HiviewDFX::HiLogLabel LABEL = { LOG_APP, NATIVE_DOMAIN, NATIVE_TAG };
 
#define NATIVE_DEBUG(...) HiviewDFX::HiLog::Debug(LABEL, __VA_ARGS__)
#define NATIVE_INFO(...) HiviewDFX::HiLog::Info(LABEL, __VA_ARGS__)
#define NATIVE_WARN(...) HiviewDFX::HiLog::Warn(LABEL, __VA_ARGS__)
#define NATIVE_ERR(...) HiviewDFX::HiLog::Error(LABEL, __VA_ARGS__)
 
const bool isDebugEnable = HiLogIsLoggable(NATIVE_DOMAIN, "", LOG_DEBUG);
const bool isInfoEnable = HiLogIsLoggable(NATIVE_DOMAIN, "", LOG_INFO);
const bool isWarnEnable = HiLogIsLoggable(NATIVE_DOMAIN, "", LOG_WARN);
const bool isErrorEnable = HiLogIsLoggable(NATIVE_DOMAIN, "", LOG_ERROR);
 
#define FLOG_DEBUG(fmt, ...)                                                                                           \
    do {                                                                                                               \
        if (isDebugEnable) {                                                                                           \
            NATIVE_DEBUG("[menubar Native]: %{public}s --> " fmt, FILE_TAG, ##__VA_ARGS__);                            \
        }                                                                                                              \
    } while (0)
 
#define FLOG_INFO(fmt, ...)                                                                                            \
    do {                                                                                                               \
        if (isInfoEnable) {                                                                                            \
            NATIVE_INFO("[menubar Native]: %{public}s --> " fmt, FILE_TAG, ##__VA_ARGS__);                             \
        }                                                                                                              \
    } while (0)
 
#define FLOG_WARN(fmt, ...)                                                                                            \
    do {                                                                                                               \
        if (isWarnEnable) {                                                                                            \
            NATIVE_WARN("[menubar Native]: %{public}s --> " fmt, FILE_TAG, ##__VA_ARGS__);                             \
        }                                                                                                              \
    } while (0)
 
#define FLOG_ERR(fmt, ...)                                                                                             \
    do {                                                                                                               \
        if (isErrorEnable) {                                                                                           \
            NATIVE_ERR("[menubar Native]: %{public}s --> " fmt, FILE_TAG, ##__VA_ARGS__);                              \
        }                                                                                                              \
    } while (0)
 
#endif // MENUBARNATIVE_LOG_H
