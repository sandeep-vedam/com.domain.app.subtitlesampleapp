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

import {
  Router,
  Utils,
} from '@lightningjs/sdk';

import routes from './lib/routes';
import settings from './lib/Settings';

export default class App extends Router.App {
  static getFonts() {
    const fonts = settings.fonts.map(({label, value}) => {
			return {family: label, url: Utils.asset(value)}
		});
		return fonts
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
