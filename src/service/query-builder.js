import { get, isEmpty } from 'lodash'

/**
 * Create query to filter by fields
 * @author Gabriel Pereira Bastos
 * @param fields { Object }
 */
export function filterByFields(fields) {

    const nome = get(fields, 'nome', '')
    const tipo_de_requisicao = get(fields, 'tipo_de_requisicao', '')
    const usuario = get(fields, 'id_usuario', '')
    const operador = get(fields, 'id_operador', '')
    const operacao = get(fields, 'operacao', '')
    const dataInicio = get(fields, 'data_inicial', '')
    const dataFinal = get(fields, 'data_final', '')
    const campos_alterados = get(fields, 'campos_alterados', [])

    let filter = ''
    filter += !isEmpty(nome) ? _addField(filter, {nome}) : ''
    filter += !isEmpty(tipo_de_requisicao) ? _addField(filter, {tipo_de_requisicao}) : ''
    filter += !isEmpty(usuario) ? _addField(filter, usuario) : ''
    filter += !isEmpty(operador) ? _addField(filter, operador) : ''
    filter += !isEmpty(operacao) ? _addField(filter, operacao) : ''

    if(!isEmpty(dataInicio) && !isEmpty(dataFinal)){
        _addField(filter, `data: {$gte: ${dataInicio}, $lte:${dataFinal}}`)
    } else {
        filter += !isEmpty(dataInicio) ? _addField(filter, `data: $gte: ${dataInicio}`) : ''
        filter += !isEmpty(dataFinal) ? _addField(filter, `data: $lte: ${dataFinal}`) : ''
    }
    filter += !isEmpty(campos_alterados) ? _addField(filter, `campos_alterados: { $in: ${campos_alterados}}`) : ''

    return { filter }
}

function _addField(pipe, field) {
    let filter
    const [key, value] = Object.entries(field)[0]
    isEmpty(pipe) ? filter = `${key}:${value}` : filter = pipe + ', ' + field
    return filter
}
