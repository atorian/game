
export default class AttackBar extends HTMLElement {
    root: ShadowRoot;
    _value: number;
    valSpan: HTMLSpanElement;
    bar: HTMLDivElement;

    constructor() {
        super();
        this.root = this.attachShadow({ mode: 'open' });
        this.root.innerHTML = `
            <style>
                :host {
                    height: 10px;
                    text-align: center;
                    display: block;
                    width: 100%;
                    position: relative;
                    line-height: 10px;
                    color: black;
                    font-size: 10px;
                }
                span {
                    font-family: Helvetica, Arial;
                    font-width: bold;
                    font-size: 8px;
                    color: white;
                }
                div {
                    position: absolute;
                    z-index:-1;
                    top:0;
                    left:0;
                    height: 100%;
                    background-color: deepskyblue;
                    transition: width 0.5s;
                    transition-timing-function: ease-out;
                }
            </style>
            <span></span>
            <div style="width: 0%"></div>
        `;
        this.valSpan = this.root.querySelector('span');
        this.bar = this.root.querySelector('div');
    }

    set value(next) {
        this._value = next;
        this.bar.style.width = `${Math.min(this._value, 100)}%`;
        this.valSpan.innerText = this._value;
    }

    static get observedAttributes() {
        return ['value'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'value') {
            this.value = newValue;
        }
    }
}
