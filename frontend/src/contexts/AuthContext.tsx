import React, { useState, useEffect, ReactNode } from 'react'
import { storage, api, ROLES } from '../helpers'
import { useQueryGenerator } from '../hooks'

type SaveTokenFunction = (val?: string) => void
type SaveTokenAndProfileFunction = (data?: any) => void

type ContextProps = {
  isAuth: () => boolean
  saveRefreshToken: SaveTokenFunction
  saveProfile: SaveTokenAndProfileFunction
  saveTokensAndProfile: SaveTokenAndProfileFunction
  profile: Partial<UserProps>
  logout: () => void
}

export const AuthContext = React.createContext<Partial<ContextProps>>({})

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<Partial<UserProps>>({})
  const { data: profileData, error: profileError, request: fetchProfile } = useQueryGenerator(api.profile, storage.load('token'))

  useEffect(() => {
    if (storage.load('token')) {
      fetchProfile({ localMethod: 'GET' })
    }
  }, [])

  // Attemp to load profile when first opening the page
  useEffect(() => {
    if (profileData) {
      saveProfile(profileData)
    }
  }, [profileData])

  const saveProfile: SaveTokenAndProfileFunction = (user) => {
    if (!user) {
      setProfile({})
      return
    }
    setProfile({
      uuid: user.uuid,
      fullName: user.full_name,
      email: user.email,
      role: user.role,
      roleName: Object.keys(ROLES).find((key: string) => ROLES[key] === user.role),
      dailyHours: user.daily_work_hours,
    })
  }

  const saveTokensAndProfile: SaveTokenAndProfileFunction = (data: any) => {
    storage.save(data.access, 'token')
    storage.save(data.refresh, 'refresh_token')
    saveProfile(data.user)
  }

  const logout = () => {
    storage.clear('token')
    storage.clear('refresh_token')
    saveProfile()
  }

  const isAuth = () => (storage.load('token') ? true : false)

  const values = { isAuth, profile, saveTokensAndProfile, saveProfile, logout }
  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}
