import React, { useContext } from 'react'
import './css/product.css'
import { ShopContext } from '../context/ShopContext'
import { useParams } from 'react-router-dom'
import Breadcrum from '../components/breadcrums/breadcrum'
import ProductDisplay from '../components/productdisplay/productdisplay'
import DescriptionBox from '../components/descriptionbox/descriptionbox'
import RelatedProduct from '../components/relatedproduct/relatedproduct'

const Product = () => {

  const { all_product } = useContext(ShopContext)

  const { productId } = useParams()

  const product = all_product.find(
    (e) => e.id === Number(productId)
  )

  return (
    <div>
      <Breadcrum product={product} />
      <ProductDisplay product={product} />
      <DescriptionBox/>
      <RelatedProduct/>
    </div>
  )
}

export default Product