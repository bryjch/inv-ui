import React from 'react'

interface StatSectionProps {
  tab: string
}

export const StatSection = (props: StatSectionProps) => {
  const { tab } = props

  return (
    <section id="stat-section">
      {(() => {
        switch (tab) {
          case 'status':
            return (
              <div id="status">
                <div>
                  <h1>
                    <span style={{ fontWeight: 300 }}>INVENTORY</span> UI
                  </h1>
                </div>

                <img className="vaultboy" src="/fallout/images/vaultboy.gif" alt="Vault Boy" />
              </div>
            )

          case 'effects':
            return null

          case 'special':
            return null

          default:
            return null
        }
      })()}

      <style jsx>{`
        #stat-section {
          padding: 1rem;

          #status {
            display: flex;
            justify-content: center;
            align-items: center;

            .vaultboy {
              width: 400px;
              height: auto;
            }
          }
        }
      `}</style>
    </section>
  )
}
