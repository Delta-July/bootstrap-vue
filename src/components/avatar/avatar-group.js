import { defineComponent, h } from '../../vue'
import { NAME_AVATAR_GROUP } from '../../constants/components'
import { makePropsConfigurable } from '../../utils/config'
import { mathMax, mathMin } from '../../utils/math'
import { toFloat } from '../../utils/number'
import normalizeSlotMixin from '../../mixins/normalize-slot'
import { computeSize } from './avatar'

// @vue/component
export const BAvatarGroup = /*#__PURE__*/ defineComponent({
  name: NAME_AVATAR_GROUP,
  mixins: [normalizeSlotMixin],
  provide() {
    return { bvAvatarGroup: this }
  },
  props: makePropsConfigurable(
    {
      variant: {
        // Child avatars will prefer this variant over their own
        type: String,
        default: null
      },
      size: {
        // Child avatars will always use this over their own size
        type: String
        // default: null
      },
      overlap: {
        type: [Number, String],
        default: 0.3
      },
      square: {
        // Child avatars will prefer this prop (if set) over their own
        type: Boolean,
        default: false
      },
      rounded: {
        // Child avatars will prefer this prop (if set) over their own
        type: [Boolean, String],
        default: false
      },
      tag: {
        type: String,
        default: 'div'
      }
    },
    NAME_AVATAR_GROUP
  ),
  computed: {
    computedSize() {
      return computeSize(this.size)
    },
    overlapScale() {
      return mathMin(mathMax(toFloat(this.overlap, 0), 0), 1) / 2
    },
    paddingStyle() {
      let value = this.computedSize
      value = value ? `calc(${value} * ${this.overlapScale})` : null
      return value ? { paddingLeft: value, paddingRight: value } : {}
    }
  },
  render() {
    const $inner = h(
      'div',
      {
        staticClass: 'b-avatar-group-inner',
        style: this.paddingStyle
      },
      [this.normalizeSlot()]
    )

    return h(
      this.tag,
      {
        staticClass: 'b-avatar-group',
        attrs: { role: 'group' }
      },
      [$inner]
    )
  }
})
