import React from 'react'
import { useLocation } from 'react-router-dom'

export const ExportScreen = () => {
  const query = new URLSearchParams(useLocation().search)
  const data = query.get('data')
  return <div dangerouslySetInnerHTML={{ __html: data }}></div>
}
