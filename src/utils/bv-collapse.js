// Generic collapse transion helper component
//
// Note:
//   Applies the classes `collapse`, `show` and `collapsing`
//   during the enter/leave transition phases only
//   Although it appears that Vue may be leaving the classes
//   in-place after the transition completes
import { defineComponent, h, isVue2, mergeProps, Transition } from '../vue'
import { CLASS_NAME_SHOW } from '../constants/class-names'
import { NAME_COLLAPSE_HELPER } from '../constants/components'
import { getBCR, reflow, removeStyle, requestAF, setStyle } from './dom'

// --- Helper methods ---

// Transition event handler helpers
const onEnter = el => {
  setStyle(el, 'height', 0)
  // In a `requestAF()` for `appear` to work
  requestAF(() => {
    reflow(el)
    setStyle(el, 'height', `${el.scrollHeight}px`)
  })
}

const onAfterEnter = el => {
  removeStyle(el, 'height')
}

const onLeave = el => {
  setStyle(el, 'height', 'auto')
  setStyle(el, 'display', 'block')
  setStyle(el, 'height', `${getBCR(el).height}px`)
  reflow(el)
  setStyle(el, 'height', 0)
}

const onAfterLeave = el => {
  removeStyle(el, 'height')
}

// --- Constants ---

const CLASS_NAME_COLLAPSE = 'collapse'
const CLASS_NAME_COLLAPSING = 'collapsing'

// Default transition props
// `appear` will use the enter classes
const TRANSITION_PROPS = {
  css: true,
  [isVue2 ? 'enterClass' : 'enterFromClass']: '',
  enterActiveClass: CLASS_NAME_COLLAPSING,
  enterToClass: [CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW],
  [isVue2 ? 'leaveClass' : 'leaveFromClass']: [CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW],
  leaveActiveClass: CLASS_NAME_COLLAPSING,
  leaveToClass: CLASS_NAME_COLLAPSE
}

// Default transition handlers
// `appear` will use the enter handlers
const TRANSITION_HANDLERS = {
  enter: onEnter,
  afterEnter: onAfterEnter,
  leave: onLeave,
  afterLeave: onAfterLeave
}

// --- Main component ---
// @vue/component
export const BVCollapse = /*#__PURE__*/ defineComponent({
  name: NAME_COLLAPSE_HELPER,
  functional: true,
  props: {
    appear: {
      // If `true` (and `visible` is `true` on mount), animate initially visible
      type: Boolean,
      default: false
    }
  },
  render(_, { props, data, children }) {
    return h(
      Transition,
      // We merge in the `appear` prop last
      mergeProps(data, { props: TRANSITION_PROPS, on: TRANSITION_HANDLERS }, { props }),
      // Note: `<transition>` supports a single root element only
      children
    )
  }
})
