import { ImBook } from 'react-icons/im'

import { Overlay } from './Overlay'
import { PlayerGear, PlayerStorages, Stash } from './Panels'

import { dispatch } from '@zus/tarkov/store'
import { toggleMiscPanelAction } from '@zus/tarkov/actions'

//////////////////////////
// Component definition //
//////////////////////////
export const Viewport = () => {
  const onClickItemCatalogue = (event: React.MouseEvent) => {
    switch (event.button) {
      case 0:
      case 1:
        event.preventDefault()
        dispatch(toggleMiscPanelAction('catalogue'))
        break
    }
  }

  return (
    <div id="viewport" onContextMenu={e => e.preventDefault()}>
      {/* Actions */}

      <div className="actions">
        <div className="action" onMouseDown={onClickItemCatalogue}>
          <ImBook style={{ marginRight: '0.5rem' }} />
          ITEM CATALOGUE
        </div>
      </div>

      {/* Panels */}

      <div className="panels">
        <PlayerGear />

        <PlayerStorages />

        <Stash />
      </div>

      {/* Overlay */}

      <Overlay />

      <style jsx>{`
        #viewport {
          position: relative;
          width: 100%;
          max-width: 1280px;
          height: 100vh;
          display: flex;
          flex-flow: column nowrap;
          justify-content: center;
          align-items: center;

          .panels {
            display: flex;
            flex-flow: row nowrap;
            width: 100%;
          }

          .actions {
            display: flex;
            margin-bottom: 1rem;

            .action {
              display: flex;
              justify-content: center;
              align-items: center;
              padding: 0.5rem 1rem;
              color: #ffffff;
              background-color: #d13d3d;
              border-radius: 5px;
              opacity: 0.9;

              &:hover {
                opacity: 1;
              }
            }
          }
        }
      `}</style>
    </div>
  )
}

export default Viewport
