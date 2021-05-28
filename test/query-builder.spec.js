import '../src/database'
import { filterByFields } from "../src/service/query-builder";

const Main = require('../src/model/Main')

describe('.filterByFields', () => {

    let mainObject
    const main = {
        id_usuario: 1,
        tipo_de_requisicao: 'POST',
        operacao: 'Salvar',
        id_operador: 2,
        data: new Date()
    }

    beforeEach( async () => {
        mainObject = await Main.create(main)
    })

    // afterEach(async () => {
    //     await mainObject.remove()
    // })

    it('given an object when attribute names exists, then create a $match pipeline successfully', (done) => {
        const filter = {
            tipo_de_requisicao: 'POST'
        }
        const aggregatePipeline = filterByFields(filter)
        expect(aggregatePipeline).toEqual(["POST"])
        done()
    })
})
