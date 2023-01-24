/*
 * If not stated otherwise in this file or this component's LICENSE file the
 * following copyright and licenses apply:
 *
 * Copyright 2020 Metrological
 *
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Utils, Router } from '@lightningjs/sdk'
import routes from './lib/routes'

export default class App extends Router.App {
  static getFonts() {
    return [
      { family: 'Roboto', url: Utils.asset('fonts/Roboto-Regular.ttf') },
      { family: 'Italic', url: Utils.asset('fonts/HighwayItalic-yad3.otf') },
      { family: 'Graphik', url: Utils.asset('fonts/GraphikBold.otf') },
      { family: 'Liberator', url: Utils.asset('fonts/Liberator-Medium.otf') },
    ]
  }

  static _template() {
    return {
      ...super._template(),
    }
  }

  _setup() {
    Router.startRouter(routes, this)
  }
}
