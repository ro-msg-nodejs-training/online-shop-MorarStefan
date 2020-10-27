let categories = [{
        id: 1,
        name: 'Mobile Phones',
        description: 'Special offer'
    },
    {
        id: 2,
        name: 'Laptops',
        description: 'Special offer'
    },
];

async function retrieve() {
    return Promise.resolve(categories);
}

module.exports = retrieve();