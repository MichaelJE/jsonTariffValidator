export default {
  uom: { type: 'string' },
  type: { type: 'string' },
  id: { type: 'string' },
  taxes: {
    type: 'array',
    child: false,
    components: {
    name: { type: 'string' },
    rate: { type: 'string' }
    }
  },
  duties: {
    type: 'map',
    child: false,
    components: {
    name: { type: 'string' },
    rate: { type: 'string' },
    }
  },
  children: {
    type: 'array',
    child: true
  }
}