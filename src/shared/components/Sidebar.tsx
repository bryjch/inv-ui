import React, { useState, useEffect } from 'react'
import { FaGithub, FaCog } from 'react-icons/fa'
import { FiMenu, FiExternalLink } from 'react-icons/fi'

import { dispatch, useStore } from '@zus/store'
import { toggleSidebarAction, setActiveGameAction, toggleUIPanelAction } from '@zus/actions'

import { useEventListener } from '@utils/hooks'
import { isDeviceMobile } from '@utils/device'

import { Game } from '@shared/data/definitions'
import { GITHUB, GAMES } from '@constants/config'

export const Sidebar = () => {
  const [isMobile, setIsMobile] = useState(isDeviceMobile())
  const isOpen = useStore(state => state.ui.sidebarOpen)
  const activeGame = useStore(state => state.app.activeGame)

  //
  // ─── LIFECYCLE ──────────────────────────────────────────────────────────────────
  //

  const onToggleBurger = () => dispatch(toggleSidebarAction())
  const onMouseEnter = () => !isMobile && dispatch(toggleSidebarAction(true))
  const onMouseLeave = () => !isMobile && dispatch(toggleSidebarAction(false))

  const onWindowResize = () => {
    if (window.innerWidth < 768) {
      if (!isMobile) setIsMobile(true)
    } else {
      if (isMobile) setIsMobile(false)
    }
  }

  useEffect(() => onWindowResize(), []) // eslint-disable-line react-hooks/exhaustive-deps
  useEventListener('resize', onWindowResize)

  //
  // ─── METHODS ────────────────────────────────────────────────────────────────────
  //

  const setActiveGame = (game: Game | null) => () => {
    if (!game || !activeGame || (activeGame && activeGame.id !== game.id)) {
      dispatch(toggleUIPanelAction('SettingsPanel', false))
      dispatch(setActiveGameAction(game))
    }
  }

  const showGameSettings = () => () => {
    dispatch(toggleUIPanelAction('SettingsPanel'))
  }

  //
  // ─── RENDER ─────────────────────────────────────────────────────────────────────
  //

  const cls = []
  if (isMobile) cls.push('mobile')
  if (isOpen || (!isMobile && !activeGame)) cls.push('open')

  return (
    <div id="sidebar" className={cls.join(' ')}>
      <div className="burger" onClick={onToggleBurger}>
        <FiMenu size={30} color="#ffffff" />
      </div>

      <div className="main-panel" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        {/* Title */}

        <div className="title" onClick={setActiveGame(null)}>
          inv<span>UI</span>
        </div>

        {/* Options */}

        <div className="options">
          {GAMES.map(game => (
            <div
              key={`game-swap-option-${game.id}`}
              className={`option ${activeGame?.id === game.id ? 'active' : ''}`}
              onClick={setActiveGame(game)}
            >
              <img src={game.image} alt={game.name} />

              <div className="settings" onClick={showGameSettings()}>
                <FaCog size={15} />
              </div>

              <div className="popover">{game.name}</div>
            </div>
          ))}
        </div>

        {/* Others */}

        <div className="others">
          <a
            className="action github"
            href={GITHUB.PROJECT_URL}
            title="Github"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub size={26} />

            <div className="popover">
              <div>Github</div>
              <FiExternalLink size={15} style={{ marginLeft: 6, marginTop: -1 }} />
            </div>
          </a>
        </div>
      </div>

      <style jsx>{`
        #sidebar {
          display: flex;
          flex-flow: column nowrap;
          justify-content: flex-start;
          align-items: center;
          pointer-events: none;
          position: absolute;
          z-index: 600;
          top: 1rem;
          bottom: 1rem;
          left: 1rem;

          .burger {
            display: none;
            position: absolute;
            top: 0;
            left: 0;
            pointer-events: auto;
            cursor: pointer;
            background-color: var(--main-panel-color);
            border-radius: 12px;
            justify-content: center;
            align-items: center;
            width: 50px;
            height: 50px;
          }

          .main-panel {
            display: flex;
            flex-flow: column nowrap;
            justify-content: flex-start;
            align-items: center;
            text-align: center;
            width: ${Sidebar.WIDTH}px;
            padding: 1rem 0;
            margin: auto 0;
            background-color: rgba(var(--main-panel-color-rgb), 0.9);
            border-radius: 12px;
            transform: scale(0.66);
            transform-origin: left center;
            transition: 0.5s ease all;
            pointer-events: auto;
          }

          &.open {
            .main-panel {
              left: 0;
              background-color: var(--main-panel-color);
              transform: scale(1);
            }
          }

          &.mobile {
            .burger {
              display: flex;
            }

            .main-panel {
              margin-top: 80px;
              margin-left: -${Sidebar.WIDTH * 2}px;
              transform: scale(1);
            }
          }

          &.mobile.open {
            .main-panel {
              margin-left: 0;
            }
          }
        }

        .title {
          position: relative;
          letter-spacing: 3px;
          padding: 0.1rem 0.2rem 0.1rem calc(0.2rem + 3px);
          margin-bottom: 0.33rem;
          image-rendering: -webkit-optimize-contrast;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 300;
          color: #ffffff;
          transition: 0.3s ease all;

          span {
            font-weight: 900;
            color: var(--main-accent-color);
          }

          &:hover {
            color: var(--main-panel-color);
            background: #ffffff;

            span {
              color: var(--main-panel-color);
            }
          }
        }

        .options {
          padding-bottom: 1rem;

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

            .settings {
              display: flex;
              justify-content: center;
              align-items: center;
              position: absolute;
              bottom: -1px;
              right: -1px;
              border-radius: 50%;
              padding: 0.2rem;
              color: #ffffff;
              background-color: var(--main-panel-color);
              transform: scale(0);
              pointer-events: none;
              transition: 0.3s ease all;

              &:hover {
                background-color: #ffffff;
                color: var(--main-panel-color);
                animation: spin 3s linear 0s infinite forwards;
              }

              @keyframes spin {
                from {
                  transform: rotateZ(0deg);
                }
                to {
                  transform: rotateZ(360deg);
                }
              }
            }

            /* Border (use :after) to prevent dimension resizing */
            &:before {
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
              background-color: rgba(var(--main-accent-color-rgb), 0.5);
              transform: scale(1.1);

              .popover {
                opacity: 1;
                left: ${Sidebar.WIDTH - 10}px;
                transform: scale(0.9);
              }
            }

            &.active {
              &:before {
                border: 2px solid var(--main-accent-color);
              }

              & .settings {
                display: flex;
                transform: scale(1);
                pointer-events: auto;
              }
            }

            &:hover.active {
              background-color: var(--main-accent-color);
            }
          }
        }

        .others {
          .action {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 50%;
            color: #ffffff;
            width: 34px;
            height: 34px;
            transition: 0.3s ease all;

            &:hover {
              background-color: #ffffff;
              color: var(--main-panel-color);

              .popover {
                opacity: 1;
                left: ${Sidebar.WIDTH - 10}px;
              }
            }
          }
        }

        .popover {
          position: absolute;
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
          top: calc(50% - 15px);
          left: ${Sidebar.WIDTH - 20}px;
          color: #ffffff;
          background-color: rgba(0, 0, 0, 0.8);
          height: 30px;
          line-height: 30px;
          font-size: 0.8rem;
          letter-spacing: 2px;
          padding: 0 10px 0 12px;
          border-radius: 4px;
          pointer-events: none;
          text-transform: uppercase;
          opacity: 0;
          transition: 0.3s ease all;
        }
      `}</style>
    </div>
  )
}

Sidebar.WIDTH = 80
