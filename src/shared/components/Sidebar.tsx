import React from 'react'
import { FaGithub } from 'react-icons/fa'

import { dispatch, useStore } from '@zus/store'
import { toggleSidebarAction, setActiveGameAction } from '@zus/actions'

import { hexToRgba } from '@utils/styling'
import { GITHUB_URL } from '@constants/config'

import { GAMES } from '@constants/config'

export const Sidebar = () => {
  const isOpen = useStore(state => state.ui.sidebarOpen)
  const activeGame = useStore(state => state.app.activeGame)

  //
  // ─── LIFECYCLE ──────────────────────────────────────────────────────────────────
  //

  const onMouseEnter = () => dispatch(toggleSidebarAction(true))
  const onMouseLeave = () => dispatch(toggleSidebarAction(false))

  //
  // ─── RENDER ─────────────────────────────────────────────────────────────────────
  //

  return (
    <div
      id="sidebar"
      className={isOpen ? 'open' : ''}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="options">
        {GAMES.map(game => (
          <div
            key={`game-swap-option-${game.id}`}
            className={`option ${activeGame?.id === game.id ? 'active' : ''}`}
            onClick={() => dispatch(setActiveGameAction(game))}
          >
            <img src={game.image} alt={game.name} />

            <div className="name">{game.name}</div>
          </div>
        ))}
      </div>

      <div className="others">
        <a
          className="external-link github"
          href={GITHUB_URL}
          title="Github"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaGithub size={26} color="#ffffff" />
        </a>
      </div>

      <style jsx>{`
        #sidebar {
          display: flex;
          flex-flow: column nowrap;
          justify-content: flex-start;
          align-items: center;
          width: ${Sidebar.WIDTH}px;
          position: absolute;
          z-index: 99999;
          padding: 0.5rem;
          top: 0;
          bottom: 0;
          left: ${-Sidebar.WIDTH}px;
          transition: 0.5s ease all;

          /* Use :after to make an invisible hoverable area */
          &:after {
            content: '';
            position: absolute;
            height: 100%;
            top: 0;
            left: ${Sidebar.WIDTH}px;
            width: ${Sidebar.WIDTH}px;
            transition: inherit;
          }

          &.open {
            left: 0;
            background-color: #202225;

            &:after {
              width: 0;
            }
          }

          .options {
            margin: auto;

            .option {
              position: relative;
              cursor: pointer;
              line-height: 0;
              padding: 5px;
              border-radius: 50%;
              margin: 0.5rem 0;
              transition: 0.3s ease all;
              user-select: none;

              img {
                width: 50px;
                height: 50px;
                image-rendering: -webkit-optimize-contrast;
              }

              .name {
                position: absolute;
                top: calc(50% - 15px);
                left: ${Sidebar.WIDTH - 20}px;
                color: #ffffff;
                background-color: rgba(0, 0, 0, 0.8);
                height: 30px;
                line-height: 30px;
                padding: 0 15px;
                font-size: 0.8rem;
                letter-spacing: 2px;
                text-transform: uppercase;
                opacity: 0;
                pointer-events: none;
                transition: 0.3s ease all;
              }

              &:after {
                content: '';
                position: absolute;
                width: 100%;
                height: 100%;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                border-radius: 50%;
                border: 1px dashed rgba(255, 255, 255, 0.2);
                transition: 0.3s ease all;
              }

              &:hover {
                background-color: ${hexToRgba('#b4c7ec', 0.5)};
                transform: scale(1.1);

                .name {
                  opacity: 1;
                  left: ${Sidebar.WIDTH - 5}px;
                  transform: scale(0.9);
                }
              }

              &.active {
                &:after {
                  border: 2px solid #b4c7ec;
                }
              }

              &:hover.active {
                background-color: ${hexToRgba('#b4c7ec', 1)};
              }
            }
          }

          .others {
            margin-bottom: 0.5rem;

            .external-link {
              display: flex;
              justify-content: center;
              align-items: center;
              border-radius: 50%;
              width: 40px;
              height: 40px;
              transition: 0.3s ease all;

              &:hover {
                background-color: ${hexToRgba('#b4c7ec', 1)};
              }
            }
          }
        }
      `}</style>
    </div>
  )
}

Sidebar.WIDTH = 80
