<template>
  <component :is="elementLayout" ref="container">
    <template #element>
      <div :class="classes.wrapper" :aria-labelledby="labelId" role="radiogroup" class="">
        <RadiogroupRadio
          v-for="(item, index, key) in resolvedOptions"
          :items="resolvedOptions"
          :index="index"
          :item="item"
          :value="item.value"
          :key="key"
          :attrs="aria"
        >
          <template #default="scope">
            <slot name="radio" v-bind="scope" :el$="el$">
              <component :is="fieldSlots.radio" v-bind="scope" :el$="el$" />
            </slot>
          </template>
        </RadiogroupRadio>
      </div>
    </template>

    <!-- Default element slots -->
    <template v-for="(component, slot) in elementSlots" #[slot]
      ><slot :name="slot" :el$="el$"><component :is="component" :el$="el$" /></slot
    ></template>
  </component>
</template>

<script>
export default {
  name: 'RadiogroupElement',
  data() {
    return {
      merge: true,
      defaultClasses: {
        container: '',
        wrapper: '',
      },
    }
  },
}
</script>

<style lang="scss">
[role='radiogroup'] {
  display: flex !important;
  flex-direction: row !important;
  gap: 1.5rem !important;
  align-items: center !important;
  flex-wrap: wrap !important;

  .vf-radio-container {
    display: inline-flex !important;
    flex-direction: row !important;
    align-items: center !important;
    flex-shrink: 0 !important;
    margin: 0 !important;
    margin-bottom: 0 !important;
    width: auto !important;

    .vf-radio {
      margin-right: 0.5rem !important;
    }

    .vf-radio-text {
      margin: 0 !important;
    }
  }
}
</style>
