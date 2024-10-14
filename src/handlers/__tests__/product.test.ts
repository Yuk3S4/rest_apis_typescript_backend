import request from 'supertest'
import server from '../../server'

describe('POST /api/products', () => { 

    it('should display validation errors', async() => {
        const response = await request( server ).post('/api/products').send({})

        expect( response.status ).toBe(400)
        expect( response.body ).toHaveProperty('errors')
        expect( response.body.errors ).toHaveLength(4)
        
        expect( response.status ).not.toBe(404)
        expect( response.body.errors ).not.toHaveLength(2)
    })

    it('should validate that the price is greater than 0', async() => {
        const response = await request( server ).post('/api/products').send({
            name: 'Monitor Curvo',
            price: 0
        })

        expect( response.status ).toBe(400)
        expect( response.body ).toHaveProperty('errors')
        expect( response.body.errors ).toHaveLength(1)
        
        expect( response.status ).not.toBe(404)
        expect( response.body.errors ).not.toHaveLength(2)
    })

    it('should validate that the price is a number and greater than 0', async() => {
        const response = await request( server ).post('/api/products').send({
            name: 'Monitor Curvo',
            price: 'Hola'
        })

        expect( response.status ).toBe(400)
        expect( response.body ).toHaveProperty('errors')
        expect( response.body.errors ).toHaveLength(2)
        
        expect( response.status ).not.toBe(404)
        expect( response.body.errors ).not.toHaveLength(4)
    })
    
    it('should create a new product', async() => {
        const response = await request( server ).post('/api/products').send({
            name: "Mouse - Testing",
            price: 100
        })

        expect( response.status ).toBe(201)
        expect( response.body ).toHaveProperty('data')
        
        expect( response.status ).not.toBe(404)
        expect( response.status ).not.toBe(200)
        expect( response.body ).not.toHaveProperty('error')
    })

})

describe('GET /api/products', () => {

    it('should check if api/products url exists', async() => {
        const response = await request( server ).get('/api/products')
        expect( response.status ).not.toBe(404)
    })

    it('GET a JSON response with products', async() => {

        const response = await request( server ).get('/api/products')
        expect( response.status ).toBe(200)
        expect( response.headers['content-type'] ).toMatch(/json/)
        expect( response.body ).toHaveProperty( 'data' )
        expect( response.body.data ).toHaveLength(1)        
        expect( response.body ).not.toHaveProperty( 'errors' )

    })

})

describe('GET /api/products/:id', () => { 
    
    it('should return a 404 response for a non-existent product', async() => {
        
        const productsId = 2000
        const response = await request( server ).get(`/api/products/${ productsId }`)
        expect( response.status ).toBe(404)
        expect( response.body ).toHaveProperty('error')
        expect( response.body.error ).toBe('Producto no encontrado')
        
    })
    
    it('should check a validate ID in the URL', async() => {
        
        const response = await request( server ).get(`/api/products/not-valid-url`)
        expect( response.status ).toBe(400)
        expect( response.body ).toHaveProperty('errors')
        expect( response.body.errors ).toHaveLength(1)
        expect( response.body.errors[0].msg ).toBe('Id no válido')        
        
    })

    it('get a JSON response for a single product', async() => {
        
        const response = await request( server ).get(`/api/products/1`)
        expect( response.status ).toBe(200)
        expect( response.body ).toHaveProperty('data')
        
    })

})

describe('PUT /api/products/:id', () => { 

    it('should check a validate ID in the URL', async() => {
        
        const response = await request( server )
                                 .put(`/api/products/not-valid-url`)
                                 .send({
                                    name: "Monitor Curvo Actualizado",
                                    price: 100,
                                    availability: true
                                })
        expect( response.status ).toBe(400)
        expect( response.body ).toHaveProperty('errors')
        expect( response.body.errors ).toHaveLength(1)
        expect( response.body.errors[0].msg ).toBe('Id no válido')        
        
    })
    
    it('should display validation error messages when updating a product', async() => {
      
        const response = await request( server ).put('/api/products/1').send({})
        expect( response.status ).toBe(400)
        expect( response.body ).toHaveProperty('errors')
        expect( response.body.errors ).toHaveLength(5)
        
        expect( response.status ).not.toBe(200)
        expect( response.body ).not.toHaveProperty('data')
    })

    it('should validate that the price is greather than0', async() => {
      
        const response = await request( server )
                                    .put('/api/products/1')
                                    .send({
                                        name: "Monitor Curvo Actualizado",
                                        price: 0,
                                        availability: true
                                    })
        expect( response.status ).toBe(400)
        expect( response.body ).toHaveProperty('errors')
        expect( response.body.errors ).toHaveLength(1)
        expect( response.body.errors[0].msg ).toBe('El precio del producto no es válido')
        
        expect( response.status ).not.toBe(200)
        expect( response.body ).not.toHaveProperty('data')
    })

    it('should return a 404 response for a non-existent product', async() => {
      
        const productId = 2000
        const response = await request( server )
                                    .put(`/api/products/${ productId }`)
                                    .send({
                                        name: "Monitor Curvo Actualizado",
                                        price: 300,
                                        availability: true
                                    })
        expect( response.status ).toBe(404)
        expect( response.body.error ).toBe('Producto no encontrado')
        
        expect( response.status ).not.toBe(200)
        expect( response.body ).not.toHaveProperty('data')
    })

    it('should update an existing product with valid data', async() => {
    
        const response = await request( server )
                                    .put(`/api/products/1`)
                                    .send({
                                        name: "Monitor Curvo Actualizado",
                                        price: 300,
                                        availability: true
                                    })
        expect( response.status ).toBe(200)
        expect( response.body ).toHaveProperty('data')
        
        expect( response.status ).not.toBe(400)
        expect( response.body ).not.toHaveProperty('errors')
    })
})

describe('PATCH /api/products', () => {
    
    it('should return a 404 response for a non-existing product', async() => {
        
        const productId = 2000
        const response = await request( server ).patch(`/api/products/${ productId }`)
        expect( response.status ).toBe(404)
        expect( response.body.error ).toBe('Producto no encontrado')
        
        expect( response.status ).not.toBe(200)
        expect( response.body ).not.toHaveProperty('data')
    })

    it('should update the product availability', async() => {

        const response = await request( server ).patch(`/api/products/2`)
        expect( response.status ).toBe(200)
        expect(response.body).toHaveProperty('data')
        expect( response.body.data.availability ).toBe(false)
        
        expect( response.status ).not.toBe(404)
        expect( response.status ).not.toBe(400)
        expect(response.body).not.toHaveProperty('errors')
    })

})

describe('DELETE /api/products', () => {

    it('should check a valid ID', async() => {
        const response = await request( server ).delete('/api/products/hola')
        expect( response.status ).toBe(400)
        expect( response.body ).toHaveProperty('errors')
        expect( response.body.errors[0].msg ).toBe('Id no válido')
    })

    it('should return a 404 response for a non-existent product', async() => {

        const productId = 2000
        const response = await request( server ).delete(`/api/products/${ productId }` )
        expect( response.status ).toBe(404)
        expect( response.body.error ).toBe('Producto no encontrado')

        expect( response.status ).not.toBe(200)
    })

    it('should delete a product', async() => {
        const response = await request( server ).delete('/api/products/1')
        expect( response.status ).toBe(200)
        expect( response.body.data ).toBe('Producto eliminado')

        expect( response.status ).not.toBe(400)
        expect( response.status ).not.toBe(404)
    })

})
