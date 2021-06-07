import { filterByFields } from "../src/service/query-builder";


describe('.filterByFields', () => {

    it('given an object when attribute names exists, then creates a filter with all fields', () => {
        const filter = {
            tipo_de_requisicao: 'POST',
        }
        const result = filterByFields(filter)
        expect(result).toEqual(filter)
    })

    it('given an object when attribute names dont exist, then creates a filter only with the existing fields ', function () {
        const filter = {
            tipo_de_requisicao: 'POST',
            atributo_mendigo: 'chablau'
        }
        const result = filterByFields(filter)
        expect(result).toEqual({tipo_de_requisicao: filter.tipo_de_requisicao, nome: filter.nome})
    });
})
