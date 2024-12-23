import { useEffect, useState } from 'react'
import RestaurantList from './restaurant/page'
import BarList from './bar/page'

const RecommentPage = () => {
  return (
    <div>
      <h1>Recomment</h1>
      <RestaurantList />
      <BarList />
    </div>
  )
}

export default RecommentPage
