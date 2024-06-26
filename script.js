class Calculadora {

    constructor() {
        this.nrVisor = '0';
        this.ptDecimal = false;
        this.iniciouSegundo = false;
        this.estadoErro = false;
        this.memTemp = '';
        this.memoria = 0;
        this.op = {
            NOP: 0,
            DIV: 1,
            MULT: 2,
            SUB: 3,
            SUM: 4,
            RQ: 5,
            TS: 6,
        };
        this.opAtual = this.op.NOP;
    }

    // Retorna o contúdo do visor
    mostraVisor() {
        return this.nrVisor;
    }

    // Recebe um dígito
    insereDigito(dig) {
        if (this.estadoErro) return;
        if (dig.length != 1) return;
        if ((dig < '0' || dig > '9') && dig != '.') return;
        if (!this.iniciouSegundo && this.opAtual != this.op.NOP && this.op.RQ) {
            this.iniciouSegundo = true;
            this.ptDecimal = false;
            this.nrVisor = '0';
        }
        if (dig == '.') {
            if (this.ptDecimal) return;
            this.ptDecimal = true;
        }
        if (this.nrVisor.length == 10) return;
        if (this.nrVisor == '0') {
            this.nrVisor = dig == '.' ? '0.' : dig;
        } else {
            this.nrVisor += dig;
        }
    }

    // Define a operação atual
    defineOperacao(op) {
        if (this.estadoErro) return;
        
        switch (op) {
            case '+':
                this.opAtual = this.op.SUM;
                break;
            case '-':
                this.opAtual = this.op.SUB;
                break;
            case '*':
                this.opAtual = this.op.MULT;
                break;
            case '/':
                this.opAtual = this.op.DIV;
                break;
            case 'RQ':
                this.opAtual = this.op.RQ;
                break;
            case 'TS':
                this.opAtual = this.op.TS;
                break;    
        }
        
        this.memTemp = this.nrVisor;
      
    }

    // Executa operação: tecla IGUAL
    igual() {
        if (this.estadoErro) return;
        let num1 = parseFloat(this.memTemp);
        let num2 = parseFloat(this.nrVisor);
        let resultado = 0;
        switch (this.opAtual) {
            case this.op.SUM:
                resultado = num1 + num2;
                break;
            case this.op.SUB:
                resultado = num1 - num2;
                break;
            case this.op.MULT:
                resultado = num1 * num2;
                break;
            case this.op.DIV:
                // PERIGO: DIVISÃO POR ZERO
                if (num2 == 0) {
                    this.estadoErro = true;
                    this.nrVisor = 'ERRO!';
                    return;
                }
                resultado = num1 / num2;
                    break;
                case this.op.RQ:
                if (num1 < 0) {
                    this.estadoErro = true;
                    this.nrVisor = 'ERRO!';
                    return;
                } 
                let aproximacao = num1 / 2;
                for (let i = 0; i < 10; i++) {
                    aproximacao = (aproximacao + num1 / aproximacao) / 2;
                }
                aproximacao.toString()
                resultado = aproximacao;  
                break;
                
                case this.op.TS:
                resultado = num1 * -1;
                break;
        }
        this.opAtual = this.op.NOP;
        this.ptDecimal = false;
        this.iniciouSegundo = false;
        this.memTemp = '';
        this.nrVisor = String(resultado).slice(0, 10);
    }

    // Limpa o conteúdo do visor e as operações (mas não a memória)
    teclaC() {
        this.nrVisor = '0';
        this.ptDecimal = false;
        this.memTemp = '';
        this.iniciouSegundo = false;
        this.estadoErro = false;
        this.opAtual = this.op.NOP;
    }

    // tecla M+ : acrescenta à memória o número no visor
    teclaMmais() {
        if (this.estadoErro) return;
        this.memoria += parseFloat(this.nrVisor);
    }

    // tecla M- : subtrai da memória o número no visor
    teclaMmenos() {
        if (this.estadoErro) return;
        this.memoria -= parseFloat(this.nrVisor);
    }

    // tecla RM : recupera o conteúdo da memória -> coloca no visor
    teclaRM() {
        if (this.estadoErro) return;
        this.nrVisor = String(this.memoria);
    }

    // tecla CLM : limpa totalmente o conteúdo da memória -> atribui 0
    teclaCLM() {
        if (this.estadoErro) return;
        this.memoria = 0;
    }
    
}


// ========================================================================
//      REAÇÃO A EVENTOS DO MOUSE
// ========================================================================

// Exibe o conteúdo do visor
let atualizaVisor = () => {
    document.getElementById('visor-id').innerHTML = calculadora.mostraVisor();
}

// RECEBE UM DÍGITO DA CALCULADORA
let digito = (dig) => {
    calculadora.insereDigito(dig);
    atualizaVisor();
}

// RECEBE OPERAÇÃO ATUAL
let defineOp = (op) => {
    if (calculadora.opAtual != calculadora.op.NOP) {
        igual();
        atualizaVisor();
    }
    calculadora.defineOperacao(op);   
}

// CALCULA A OPERAÇÃO
let igual = () => {
    calculadora.igual();
    atualizaVisor();
}

// TECLA C: LIMPA TUDO, EXCETO MEMÓRIA
let teclaC = () => {
    calculadora.teclaC();
    atualizaVisor();
}

// M+ ACRESCENTA À MEMÓRIA O NÚMERO ATUAL NO VISOR
let teclaMmais = () => {
    calculadora.teclaMmais();
}

// M- SUBTRAI DA MEMÓRIA O NÚMERO ATUAL NO VISOR
let teclaMmenos = () => {
    calculadora.teclaMmenos();
}

// PÕE NO VISOR O CONTEÚDO DA MEMÓRIA
let teclaRM = () => {
    calculadora.teclaRM();
    atualizaVisor();
}

// APAGA TODO O CONTEÚDO DA MEMÓRIA
let teclaCLM = () => {
    calculadora.teclaCLM();
}


// ==========  INICIALIZAÇÃO ===================
let calculadora = new Calculadora();

