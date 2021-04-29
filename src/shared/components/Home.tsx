import React from 'react'
import Helmet from 'react-helmet'

export const Home = () => {
  return (
    <>
      <Helmet>
        <title>invUI // Home</title>
      </Helmet>

      <div id="home">
        <div className="panel">
          <div className="logo no-select">
            <img src="/logo192.png" alt="invUI Logo" />
          </div>

          <div className="info">
            <div className="title">
              <span>inv</span>
              <span>UI</span>
            </div>

            <div className="description">
              Recreating game inventory UIs in the browser -
              <br />
              exploring their usability and design.
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @import 'assets/css/mixins.scss';

        #home {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;

          .panel {
            display: flex;
            flex-flow: row wrap;
            justify-content: center;
            align-items: center;
            padding: 1rem;
            color: #ffffff;

            .logo {
              width: 64px;
              height: 64px;
              margin: 0 1rem;

              img {
                width: 100%;
                height: 100%;
                image-rendering: pixelated;
                animation: bounce 3s ease 0s infinite forwards;
                @include filter-outline(2px, var(--main-accent-color));
              }

              @keyframes spin {
                from {
                  transform: rotateZ(0deg);
                }
                to {
                  transform: rotateZ(360deg);
                }
              }

              @keyframes bounce {
                0% {
                  transform: translate(0px, 0px);
                }
                6% {
                  transform: translate(0px, -4px);
                }
                9% {
                  transform: translate(0px, 0px);
                }
                12% {
                  transform: translate(0px, -4px);
                }
                15% {
                  transform: translate(0px, 0px);
                }
              }
            }

            .info {
              padding: 0 1rem 0.5rem 1rem;

              .title {
                font-size: 3rem;
                letter-spacing: 5px;

                span:nth-child(1) {
                  font-weight: 300;
                }

                span:nth-child(2) {
                  color: var(--main-accent-color);
                  font-weight: 900;
                }
              }

              .description {
                opacity: 0.8;
                line-height: 1.5;
              }
            }
          }
        }
      `}</style>
    </>
  )
}
