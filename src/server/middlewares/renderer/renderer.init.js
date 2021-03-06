
import { cloneDeep } from 'lodash'

import createStore from '../../../client/store'

export default function () {
  const initialState = createStore().getState()

  // Called first in the middleware stack,
  // its goal is to setup the base state of
  // a request.
  // It is possible to add data to the state.
  // These data will be then serialized and
  // passed to the INITIAL_STATE store.
  // For this, it is important to use the
  // ctx.state entry.
  return function init (ctx, next) {
    // Default status to unimplemented
    ctx.status = 501

    // Base state is the redux initial state
    ctx.state = cloneDeep(initialState)

    // Default no-cache and cache config in ctx.
    // NOTE: the config is not in ctx.state because
    // the all state is serialized to the client and
    // it is unnecessary to send back this info.
    ctx.set('Cache-Control', 'no-cache')
    ctx.cache = {
      maxAge: 0,
      control: 'no-cache'
    }

    // Location data:
    // this will be used by the Router and its
    // associated Link component
    ctx.state.context.location = {
      host: `${ctx.protocol}://${ctx.headers.host}`,
      path: ctx.path,
      query: Object.assign({}, ctx.query),
      url: ctx.path + ctx.search
    }

    // SEO metadata:
    // Obviously used for SSR, the client only
    // take care of the title (to update the browser
    // tab)
    ctx.state.context.metadata = {
      title: '',
      links: [],
      metas: []
    }

    // The container:
    // contains the component to render
    // and any associated props we want to
    // pass down to it.
    ctx.state.context.container = {
      component: null,
      props: {}
    }

    return next()
  }
}
