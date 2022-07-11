// --------------------------------------------------------------------------------
// Schema
// --------------------------------------------------------------------------------
const HTML = /*html*/ `
  <p>
    <slot name="demo">SKELETON</slot>
    <span class="version">0.0.0</span>
    <span class="count"></span>
  </p>
`

const CSS = './components/demo/demo.style.css'

const PROPS = {
  version: {
    sel: `.version`,
    reflects: true
  },
  count: {
    sel: `.count`,
    val: 0,
    reflects: false
  }
}

// --------------------------------------------------------------------------------
// Prototype
// --------------------------------------------------------------------------------
export class SkeletonComponent extends HTMLElement {
  constructor() {
    super() //REQ
    this._init() //REQ
  }

  // --------------------------------------------------------------------------------
  // API
  // --------------------------------------------------------------------------------
  static get observedAttributes() {
    let prArr = []
    for (const prop in PROPS) {
      prArr.push(prop.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase()))
    }

    return prArr
  } // REQ

  // --------------------------------------------------------------------------------
  // Lifecycle
  // --------------------------------------------------------------------------------
  connectedCallback() {
    this._render() // REC

    this.addEventListener('click', (e) => {
      this._props.count.val += 1
      console.log(`You've clicked me ${this._props.count.val} times`)
    })
  }

  disconnectedCallback() {}

  attributeChangedCallback(name, oldVal, newVal) {
    oldVal !== newVal && this._render()
  }
  // --------------------------------------------------------------------------------
  // Render
  // --------------------------------------------------------------------------------
  _render() {
    this._reflect() // REC
  }

  // --------------------------------------------------------------------------------
  // Framework
  // --------------------------------------------------------------------------------

  _init() {
    this._props = structuredClone(PROPS) // Deep copy of constant (Important!)
    this._template = document.createElement('template')
    this._style = document.createElement('link')
    this._shadow = this.attachShadow({ mode: 'open' })
    this._template.innerHTML = HTML
    this._shadow.appendChild(this._template.content.cloneNode(true))
    CSS && this._attachStyle() // Attach stylesheet if CSS constant provided
    Object.keys(this._props).length !== 0 && this._attachElements() // Get target DOM elements if props provided
  }

  _attachStyle() {
    this._style.setAttribute('rel', 'stylesheet')
    this._style.setAttribute('href', CSS)
    this._shadow.appendChild(this._style.cloneNode(true))
  }

  _attachElements() {
    for (const prop in this._props) {
      this._props[prop].el = this._shadow.querySelector(this._props[prop].sel)
    }
  }

  _reflect() {
    for (const prop in this._props) {
      if (this.attributes[prop] && this._props[prop].reflects !== false) {
        this._props[prop].el.textContent = this.attributes[prop].value
      }
    }
  }

  // --------------------------------------------------------------------------------
  // Utils
  // --------------------------------------------------------------------------------
  _emit(ev, data) {
    this.dispatchEvent(
      new CustomEvent(ev, {
        bubbles: true,
        detail: data
      })
    )
  }
}

// Register
customElements.define('skeleton-component', SkeletonComponent)
