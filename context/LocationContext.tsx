'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { GeographicScope, LocationHierarchy } from '@/types';
import { INITIAL_LOCATION } from '@/lib/mockData';

export interface LocationOption extends LocationHierarchy {
  label: string;
}

export const PRESET_LOCATIONS: LocationOption[] = [
  {
    label: 'Gachibowli, Hyderabad',
    area: 'Gachibowli',
    district: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
  },
  {
    label: 'Madhapur, Hyderabad',
    area: 'Madhapur',
    district: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
  },
  {
    label: 'Tarnaka, Secunderabad',
    area: 'Tarnaka',
    district: 'Secunderabad',
    state: 'Telangana',
    country: 'India',
  },
  {
    label: 'Banjara Hills, Hyderabad',
    area: 'Banjara Hills',
    district: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
  },
  {
    label: 'Indiranagar, Bengaluru',
    area: 'Indiranagar',
    district: 'Bengaluru Urban',
    state: 'Karnataka',
    country: 'India',
  },
];

interface LocationContextType {
  location: LocationHierarchy;
  scope: GeographicScope;
  setLocation: (loc: LocationHierarchy) => void;
  setScope: (scope: GeographicScope) => void;
  getActiveScopeLabel: () => string;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<LocationHierarchy>(INITIAL_LOCATION);
  const [scope, setScope] = useState<GeographicScope>('Area');

  const getActiveScopeLabel = () => {
    switch (scope) {
      case 'Area':
        return location.area;
      case 'District':
        return location.district;
      case 'State':
        return location.state;
      case 'Country':
        return location.country;
      case 'World':
        return 'Worldwide';
      default:
        return location.area;
    }
  };

  return (
    <LocationContext.Provider
      value={{
        location,
        scope,
        setLocation,
        setScope,
        getActiveScopeLabel,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}
