let products = [{
        id: 1,
        name: 'iPhone X',
        description: 'Created by Apple',
        price: 1000,
        weight: 0.1,
        categoryId: 1,
        supplier: 'Emag',
        imageUrl: 'url'
    },
    {
        id: 2,
        name: 'Huawei P30 Pro',
        description: 'Created by Huawei',
        price: 1000,
        weight: 0.1,
        categoryId: 1,
        supplier: 'Emag',
        imageUrl: 'url'
    },
];

async function retrieve() {
    return Promise.resolve(products);
}

module.exports = retrieve();