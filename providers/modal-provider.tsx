'use client'

import { StoreModal } from "@/components/modals/store-modal"
import { useEffect, useState } from "react"

interface ModalProviderProps {}

const ModalProvider: React.FC<ModalProviderProps> = () => {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) {
        return null
    }

    return (
      <>
      <StoreModal/>
      </>
    )
}

export default ModalProvider