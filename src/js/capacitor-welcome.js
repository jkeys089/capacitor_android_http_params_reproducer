import { SplashScreen } from '@capacitor/splash-screen';
import { CapacitorHttp } from '@capacitor/core';

const doGet = async () => {
  const response = await CapacitorHttp.request({
    url: 'https://httpbin.org/get',
    shouldEncodeUrlParams: true,
    params: { k: 'a&b' },
    method: 'GET'
  })

  return response.data.url
}


window.customElements.define(
  'capacitor-welcome',
  class extends HTMLElement {
    constructor() {
      super();

      SplashScreen.hide();

      const root = this.attachShadow({ mode: 'open' });

      root.innerHTML = `
    <div>
      <capacitor-welcome-titlebar>
        <h1>HTTP Params Reproducer</h1>
      </capacitor-welcome-titlebar>
      <main>
        <p>
          <span style="display: inline-block; width: 80px">Expected:</span> https://httpbin.org/get?k=a%26b
        </p>
        <p>
          <span style="display: inline-block; width: 80px">Actual:</span> <span id="result">loading...</span>
        </p>
      </main>
    </div>
    `;
    }

    async connectedCallback() {
      const self = this;

      let actualUrl
      for (let i=0; i<10; i++) {
        try {
          actualUrl = await doGet()
          break
        } catch (e) {
          if (i === 9) self.shadowRoot.querySelector('#result').textContent = `[attempt ${i}] encountered error ... giving up`
          else self.shadowRoot.querySelector('#result').textContent = `[attempt ${i}] encountered error ... retrying`
        }
      }

      self.shadowRoot.querySelector('#result').textContent = actualUrl
    }
  }
);

window.customElements.define(
  'capacitor-welcome-titlebar',
  class extends HTMLElement {
    constructor() {
      super();
      const root = this.attachShadow({ mode: 'open' });
      root.innerHTML = `
    <style>
      :host {
        position: relative;
        display: block;
        padding: 15px 15px 15px 15px;
        text-align: center;
        background-color: #73B5F6;
      }
      ::slotted(h1) {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        font-size: 0.9em;
        font-weight: 600;
        color: #fff;
      }
    </style>
    <slot></slot>
    `;
    }
  }
);
