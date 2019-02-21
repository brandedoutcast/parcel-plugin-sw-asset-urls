# ✨ parcel-plugin-sw-asset-urls

A parce-bundler plugin to replace the filename URLs in Service Worker with their hashed counterparts

    I don't really like the name of this package 😝

## Installation

`npm install parcel-plugin-sw-asset-urls -D`

or

`yarn add parcel-plugin-sw-asset-urls -D`

## What It Does

Although parcel-bundler doesn't play nice in every scenario, one cannot deny the fact that it's an amazing tool for developers. This package will help solve an issue with parcel-bundler when building PWA (Progressive Web Apps)

Most of the PWAs cache their static assets on the `install` event of a Service Worker. Although parcel generates the assets with hashed filenames in the `dist` directory & copies over the service worker (sw.js), it doesn't check & replace the original filenames with their hashed counterparts in service worker js file

This parcel-plugin solve the issue by updating the `sw.js` in `dist` directory to reflect hashed filename URLs

## License
MIT