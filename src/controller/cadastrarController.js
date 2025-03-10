import db from "../model/firebaseConfig.js";

// Validador de CPF
class ValidaCPF {
    constructor(cpfEnviado) {
        Object.defineProperty(this, 'cpfLimpo', {
            enumerable: true,
            get: function () {
                return cpfEnviado.replace(/\D+/g, '');
            },
        });
    }

    valida() {
        if (typeof this.cpfLimpo === 'undefined') return false;
        if (this.cpfLimpo.length !== 11) return false;
        if (this.isSequencia()) return false;

        const cpfParcial = this.cpfLimpo.slice(0, -2);
        const digito1 = this.criaDigito(cpfParcial);
        const digito2 = this.criaDigito(cpfParcial + digito1);

        const novoCpf = cpfParcial + digito1 + digito2;
        return novoCpf === this.cpfLimpo;
    }

    criaDigito(cpfParcial) {
        const cpfArray = Array.from(cpfParcial);

        let regressivo = cpfArray.length + 1;
        const total = cpfArray.reduce((ac, val) => {
            ac += regressivo * Number(val);
            regressivo--;
            return ac;
        }, 0);

        const digito = 11 - (total % 11);
        return digito > 9 ? '0' : String(digito);
    }

    isSequencia() {
        const sequencia = this.cpfLimpo[0].repeat(this.cpfLimpo.length);
        return sequencia === this.cpfLimpo;
    }
}

function validarCPF(cpf) {
    const validador = new ValidaCPF(cpf);
    return validador.valida();
}

export function validaCpf (req, res){
    let { cpf } = req.query;

    if (!cpf) {
        return res.status(400).send({ valido: false, message: 'CPF não fornecido.' });
    }

    // Remove pontuações
    cpf = cpf.replace(/\D+/g, '');

    const validador = new ValidaCPF(cpf);
    const valido = validador.valida();

    res.status(200).send({ valido });
}

// Função para salvar usuário no Firestore
export async function salvarDadosCadastro(req, res) {
    const { nome, email, senha } = req.body;
    let { cpf } = req.body;

    cpf = cpf.replace(/\D+/g, ''); // Remove pontuações

    // Validação de CPF
    if (!validarCPF(cpf)) {
        return res.status(400).send({ message: 'CPF inválido.' });
    }

    try {
        // Referência à coleção "cadastrar"
        const userRef = db.collection("cadastrar").doc(cpf);
        const doc = await userRef.get();

        if (doc.exists) {
            return res.status(400).send({ message: 'Este CPF já está cadastrado.' });
        }

        await userRef.set({ nome, cpf, email, senha });

        res.status(201).send({ message: 'Usuário cadastrado com sucesso!' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Erro ao cadastrar usuário' });
    }
}

// Comparar dados para login
export async function compararDadosLogin(req, res) {
    const { cpf, senha } = req.body;

    try {
        const userRef = db.collection("cadastrar").doc(cpf);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return res.status(401).json({ message: 'CPF não encontrado.' });
        }

        const userData = userDoc.data();
        if (userData.senha !== senha) {
            return res.status(401).json({ message: 'Senha incorreta.' });
        }

        res.status(200).json({ message: 'Login realizado com sucesso!', nome: userData.nome, cpf: userData.cpf });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao processar o login.' });
    }
}