import { loopData } from "@/lib/constants";
import LogoLoop from "./LoopUI";
import React from 'react'

const LoopBelowHero = () => {
  return (
    <div style={{ height: '100px', position: 'relative', overflow: 'hidden' }}>
      <LogoLoop
        logos={loopData}
        speed={100}
        direction="left"
        logoHeight={48}
        gap={56}
        hoverSpeed={0}
        scaleOnHover
        ariaLabel="Technology partners"
      />
    </div>
  )
}

export default LoopBelowHero