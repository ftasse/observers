const sampleData = [
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.128065, 52.643482]
    },
    title: 'some topic about some issue, from an observer',
    rank: 1
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.15179, 52.633333]
    },
    title: 'some topic about some issue, from an observer',
    rank: 3
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.12904, 52.629348]
    },
    title: 'some topic about some issue, from an observer',
    rank: 2
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.133005, 52.629835]
    },
    title: 'some topic about some issue, from an observer',
    rank: 4
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.137683, 52.639138]
    },
    title: 'some topic about some issue, from an observer',
    rank: 5
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.125933, 52.636256]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.125933, 52.636256]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.127873, 52.640478]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.131127, 52.632887]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.135171, 52.6376]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.131802, 52.63611]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.130026, 52.637005]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.12904, 52.629348]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.126885, 52.637432]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.153971, 52.630562]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.130751, 52.637712]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.132898, 52.636721]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.120956, 52.630187]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.12342, 52.639267]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.12933, 52.635598]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.131802, 52.63611]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.132274, 52.631664]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.113804, 52.628075]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.150101, 52.63814]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.12164, 52.637366]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.130568, 52.627525]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.114231, 52.625201]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.12636, 52.632591]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.114231, 52.625201]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.140416, 52.633161]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.124409, 52.62747]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.153971, 52.630562]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.114231, 52.625201]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.132746, 52.632485]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.121451, 52.617281]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.117117, 52.627147]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.147122, 52.634765]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.130922, 52.634279]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.13394, 52.639335]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.118725, 52.617692]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.12904, 52.629348]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.132174, 52.628499]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.133005, 52.629835]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.135034, 52.633347]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.133005, 52.629835]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.132897, 52.630787]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.128697, 52.638452]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.128697, 52.638452]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.135171, 52.6376]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.120719, 52.616961]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.134261, 52.630546]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.139112, 52.634824]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.119859, 52.64218]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.138424, 52.636033]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.11156, 52.627959]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.117533, 52.634369]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.123465, 52.628839]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.137683, 52.639138]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.130272, 52.629797]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.129529, 52.632246]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.115053, 52.629864]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.123165, 52.639454]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.132839, 52.633007]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.154142, 52.630869]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.10891, 52.631131]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.127064, 52.631392]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.12904, 52.629348]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.131127, 52.632887]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.118922, 52.627744]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.117117, 52.627147]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.131597, 52.639768]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.133005, 52.629835]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.137683, 52.639138]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.128697, 52.638452]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.121451, 52.617281]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.12933, 52.635598]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.149766, 52.626432]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.133691, 52.63625]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.114231, 52.625201]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.136001, 52.632977]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.139691, 52.627933]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.114231, 52.625201]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.12933, 52.635598]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.114231, 52.625201]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.133005, 52.629835]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.133005, 52.629835]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.133005, 52.629835]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.139118, 52.639814]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.135034, 52.633347]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.114174, 52.633894]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.130274, 52.628988]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.133005, 52.629835]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.137589, 52.627387]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.133653, 52.634407]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.121451, 52.617281]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.121128, 52.626053]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.120277, 52.627979]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.1136, 52.637414]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.11863, 52.626124]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.134261, 52.630546]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.130568, 52.627525]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.126829, 52.632073]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.115053, 52.629864]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.130026, 52.637005]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.11259, 52.634736]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.122291, 52.629963]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.129097, 52.626489]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.129529, 52.632246]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.131414, 52.637069]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.133005, 52.629835]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.117842, 52.629292]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.136001, 52.632977]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.130751, 52.637712]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.129511, 52.633145]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.121585, 52.629778]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.151977, 52.630521]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.130751, 52.637712]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.116884, 52.627729]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.131914, 52.630438]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.125933, 52.636256]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.148546, 52.625345]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.138924, 52.633888]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.128659, 52.630684]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.135906, 52.639332]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.130751, 52.637712]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.114231, 52.625201]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.138233, 52.638971]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.15147, 52.629259]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.138233, 52.638971]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.127374, 52.637327]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.154142, 52.630869]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.124369, 52.630212]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.116168, 52.63319]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.150238, 52.636388]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.136881, 52.621287]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.12077, 52.625484]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.139077, 52.635121]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.118388, 52.628613]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.134803, 52.627817]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.15426, 52.627058]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.131597, 52.639768]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.153971, 52.630562]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.119753, 52.632003]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.133653, 52.634407]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.131597, 52.639768]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.117842, 52.629292]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.114231, 52.625201]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.124083, 52.631954]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.124274, 52.640901]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.12933, 52.635598]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.124889, 52.64193]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.133005, 52.629835]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.120956, 52.630187]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.153435, 52.628455]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.12943, 52.643195]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.150477, 52.627112]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.120719, 52.616961]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.133653, 52.634407]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.119752, 52.626906]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.132898, 52.636721]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.12129, 52.641553]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.129511, 52.633145]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.118661, 52.627491]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.148815, 52.626704]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.142455, 52.627126]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.118725, 52.617692]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.12933, 52.635598]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.134658, 52.631438]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.133005, 52.629835]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.133005, 52.629835]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.132898, 52.636721]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.12933, 52.635598]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.125483, 52.640298]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.123532, 52.626988]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.129529, 52.632246]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.133653, 52.634407]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.150355, 52.622751]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.114732, 52.628909]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.140799, 52.634693]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.122319, 52.640374]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.133691, 52.63625]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.133691, 52.63625]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.119635, 52.631238]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.133653, 52.634407]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.130778, 52.631887]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.152441, 52.623341]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.12943, 52.643195]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.137683, 52.639138]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.137683, 52.639138]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.133653, 52.634407]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.134261, 52.630546]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.133005, 52.629835]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.132839, 52.633007]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.121908, 52.629888]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.117533, 52.634369]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.133638, 52.620211]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.135259, 52.63093]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.140531, 52.630312]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.128602, 52.636536]
    },
    title: 'some topic about some issue, from an observer'
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-1.140918, 52.635449]
    },
    title: 'some topic about some issue, from an observer'
  }
];
mapboxgl.accessToken = `pk.eyJ1IjoiYXNuZWxjaHJpc3RpYW4iLCJhIjoiY2thd2Z0aXJ1MDdteTJ0bXU5NDU2bHZ4MCJ9.kChV328HGtNtda8XQQc4tA`;
const map = new mapboxgl.Map({
  container: 'mapbox-topics',
  style: 'mapbox://styles/asnelchristian/ckawh4dvvehmi1io10tvsjvtk',
  maxZoom: 17
});
const getPopupHTML = title => {
  return `<div class="sm-card">
                <img src="img/politics.jpg" alt="" class="sm-card__img">
                <div class="sm-card__info">
                    <div class="sm-card__main">
                        <a href="#" class="link-info link-info--normal">${title}</a>
                    </div>
                    <div class="sm-card__sub">
                        <a href="#" class="sm-card__category sm-card__link link-info link-info--category link-info--category--small">Climate & environment</a>
                        <a href="#" class="sm-card__link link-info link-info--small link-info--small--sm">Last update on July 21, 2020</a>
                    </div>
                </div>
            </div>`;
};

const getClusterElementClass = size => {
  let min, max;
  const classMap = {
    'marker--cluster--20': [2, 20],
    'marker--cluster--50': [20, 50],
    'marker--cluster--100': [50, 100],
    'marker--cluster--500': [100, 500],
    'marker--cluster--1000': [500, 1000],
    'marker--cluster--10000': [1000, 10000],
    'marker--cluster--inf': [10000, Infinity]
  };
  const between = (val, min, max) => val >= min && val < max;

  for (let klass of Object.keys(classMap)) {
    [min, max] = classMap[klass];
    if (between(size, min, max)) {
      return klass;
    }
  }
  return '';
};
const bounds = new mapboxgl.LngLatBounds();

const index = new Supercluster({
  log: true,
  radius: 25,
  extent: 256,
  maxZoom: 17
}).load(sampleData);

sampleData.forEach((feature, i) => {
  bounds.extend(feature.geometry.coordinates);
});

let markers = [];

const update = zoom => {
  // Remove all markers currently on the map
  markers.forEach(marker => marker.remove());
  markers = [];

  // Compute the new clusters based on zoom level
  let zoomLevel = zoom || parseInt(map.getZoom());
  const clusters = index.getClusters(
    [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()],
    zoomLevel
  );
  // Create appropriate markers for each clusters
  clusters.forEach(cluster => {
    let popupHtml = '';
    const el = document.createElement('div');
    el.classList.add('marker');

    const marker = new mapboxgl.Marker({
      element: el,
      anchor: 'center'
    }).setLngLat(cluster.geometry.coordinates);

    if (cluster.properties && cluster.properties.cluster) {
      el.classList.add('marker--cluster');
      el.classList.add(getClusterElementClass(cluster.properties.point_count));
      el.innerHTML = `<span>${cluster.properties.point_count_abbreviated}</span>`;

      const expansionZoom = index.getClusterExpansionZoom(
        cluster.properties.cluster_id
      );
      if (zoomLevel >= index.options.maxZoom) {
        const leaves = index.getChildren(cluster.properties.cluster_id);
        leaves.forEach(leave => {
          popupHtml = `${popupHtml}${getPopupHTML(leave.title)}`;
        });

        el.removeEventListener('click', function() {});
        el.addEventListener('click', function() {
          clusterList.innerHTML = popupHtml;
          clusterListContainer.classList.remove('hide');
        });
      } else {
        el.addEventListener('click', function(e) {
          flyTo(cluster.geometry.coordinates, expansionZoom);
        });
      }
    } else {
      if (cluster.rank && cluster.rank <= 5) {
        el.classList.add('marker--trending');
      } else {
        el.classList.add('marker--default');
      }
      popupHtml = getPopupHTML(cluster.title);
      addPopup(marker, popupHtml, 'topic-popup');
    }
    markers.push(marker);
  });
  // Add all newly created markers to map
  markers.forEach(marker => marker.addTo(map));
};

const addPopup = (marker, popupHtml, className) => {
  marker.setPopup(
    new mapboxgl.Popup({ className }).setHTML(popupHtml).setMaxWidth('34rem')
  );
};

let ready = false;

map.on('load', () => {
  ready = false;
  update(12);
  ready = true;
});

map.on('moveend', async () => {
  if (!ready) return;
  ready = false;
  update();
  ready = true;
});

const flyTo = (center, zoom) => {
  if (!ready) return;
  ready = false;
  map.flyTo({ center, zoom });
  ready = true;
};
