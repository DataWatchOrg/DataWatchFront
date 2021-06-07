const {get, isEmpty} = require('lodash')

/**
 * Create query to filter by fields
 * @author Gabriel Pereira Bastos
 * @param fields { Object }
 */
const filterByFields = (fields) => {

    const tipo_de_requisicao = get(fields, 'tipo_de_requisicao', '')
    const usuario = get(fields, 'id_usuario', '')
    const operador = get(fields, 'id_operador', '')
    const operacao = get(fields, 'operacao', '')
    const dataInicio = get(fields, 'data_inicial', '')
    const dataFinal = get(fields, 'data_final', '')
    const campos_alterados = get(fields, 'campos_alterados', [])

    let filter = {}
    !isEmpty(campos_alterados) ? _addField(filter, 'nome', campos_alterados) : ''
    !isEmpty(tipo_de_requisicao) ? _addField(filter, 'tipo_de_requisicao', tipo_de_requisicao) : ''
    !isEmpty(usuario) ? _addField(filter, 'usuario', usuario) : ''
    !isEmpty(operador) ? _addField(filter, 'operador', operador) : ''
    !isEmpty(operacao) ? _addField(filter, 'operacao', operacao) : ''

    if (!isEmpty(dataInicio) && !isEmpty(dataFinal)) {
        _addField(filter, 'data', {$gte: dataInicio, $lte: dataFinal})
    } else {
        !isEmpty(dataInicio) ? _addField(filter, 'data', {$gte: dataInicio}) : ''
        !isEmpty(dataFinal) ? _addField(filter, 'data', {$lte: dataFinal}) : ''
    }
    !isEmpty(campos_alterados) ? _addField(filter, 'campos_alterados', {$in: campos_alterados}) : ''

    return filter
}

function _addField(filter, field, value) {
    filter[field] = value
    return filter
}

exports.filterByFields = filterByFields
