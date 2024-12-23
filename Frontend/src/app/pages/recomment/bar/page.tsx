"use client"
import { useEffect, useState } from 'react'

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState<any[]>([])

  useEffect(() => {
    const fetchRestaurants = async () => {
      const response = await fetch('http://localhost:5000/restaurant/all')
      if (response.ok) {
        const data = await response.json()
        setRestaurants(data)
      }
    }
    fetchRestaurants()
  }, [])

  return (
    <div>
      <h2>Restaurants</h2>
      <ul>
        {restaurants.map((restaurant: any) => (
          <li key={restaurant.id}>{restaurant.name}</li>
        ))}
      </ul>
    </div>
  )
}

export default RestaurantList
