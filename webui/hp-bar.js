class HPBar extends HTMLElement {
    _value: number = 1;
    _max: number = 1;
    _destroyed: number = 0;
    root: ShadowRoot;
    currentEl: HTMLDivElement;
    destroyedEl: HTMLDivElement;
    valueEl: HTMLDivElement;

    constructor() {
        super();
        this.root = this.attachShadow({ mode: 'open' });
        this.root.innerHTML = `
            <style>
            :host {
                position: relative;
                display: block;
                text-align: center;
                line-height: 20px;
                height: 20px;
                background-color: gray;
                font-family: Helvetica, Arial;
            }
            div {
                position: absolute;
                z-index: 0;
                top:0;
                left:0;
                height: 100%;
                width: 100%;
            }
            .value {
                color: white;
                z-index: 1;
                text-align: center;
                vertical-align: middle;
            }
            .current {
                background-color: green;
                left:0;
                transition: width 0.5s;
                transition-timing-function: ease-out;
            }
            .destroyed {
                background-color: red;
                right:0;
                width: 0;
                transition: width 1s;
            }
            </style>
            <div class="current"></div>
            <div class="destroyed"></div>
            <div class="value">100%</div>
        `;

        this.currentEl = this.root.querySelector('.current');
        this.destroyedEl = this.root.querySelector('.destroyed');
        this.valueEl = this.root.querySelector('.value');
    }

    static get observedAttributes() {
        return ['current', 'destroyed', 'max'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'current') {
            this.value = 1 * newValue;
        }
        if (name === 'max') {
            this.max = 1 * newValue;
        }
        if (name === 'destroyed') {
            this.destroyed = 1 * newValue;
        }
    }

    set value(next) {
        this._value = 1 * next;
        let hpP = Math.floor(this._value / (this._max - this._destroyed) * 100);
        this.valueEl.innerText = `${hpP}%`;
        this.currentEl.style.width = `${hpP}%`;
    }

    set destroyed(next) {
        this._destroyed = 1 * next;
        this.destroyedEl.style.width = `${Math.floor(this._destroyed / this._max * 100)}%`;
    }

    set max(next) {
        this._max = next;
    }
}

module.exports = HPBar;
