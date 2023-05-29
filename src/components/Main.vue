<template>
  <h1>Send CC Commands</h1>
  <div class="container">
    <div class="form-floating mb-3">
      <select id="device" v-model="dev_id" class="form-control">
        <option v-for="(item, index) in this.midiOut" v-bind:key="item.id" v-bind:value="index">
          {{item.name}}
        </option>
      </select>
      <label for="device">Select device</label>
    </div>
    <div class="form-floating mb-3">
      <input id="cc" class="form-control" type="number" v-model="cc" min="1" max="127">
      <label for="cc">CC command</label>
    </div>
    <div class="form-floating mb-3">
      <input id="channel" class="form-control" type="number" v-model="channel" min="1" max="16">
      <label for="channel">Channel</label>
    </div>
    <div class="form-floating mb-3">
      <input id="value" class="form-control" type="number" v-model="value" min="0" max="127">
      <label for="cc">Value</label>
    </div>
    <div class="form-floating mb-3">
      <button class="btn btn-primary" v-on:click="sendMidiMessage">Send</button>
    </div>
  </div>

</template>

<script>


export default {
  name: "MainPage",
  data() {
    return {
      cc: 1,
      channel: 1,
      value: 0,
      dev_id: 0,
      midiIn: [],
      midiOut: []
    }
  },
  methods: {
    midiReady(midi) {
      // Also react to device changes.
      midi.addEventListener('statechange', (event) => this.initDevices(event.target));
      this.initDevices(midi); // see the next section!
    },
    initDevices(midi) {
      // Reset.
      this.midiIn = [];
      this.midiOut = [];

      // MIDI devices that send you data.
      const inputs = midi.inputs.values();
      for (let input = inputs.next(); input && !input.done; input = inputs.next()) {
        this.midiIn.push(input.value);
        console.log(input.value);
      }

      // MIDI devices that you send data to.
      const outputs = midi.outputs.values();
      for (let output = outputs.next(); output && !output.done; output = outputs.next()) {
        this.midiOut.push(output.value);
      }
    },

    sendMidiMessage() {
      const device = this.midiOut[this.dev_id];
      const msgOn = [0xB0 | this.channel - 1, this.cc, this.value];

      // First send the note on;
      device.send(msgOn);


    }

  },
  mounted() {
    navigator.requestMIDIAccess()
        .then(
            (midi) => this.midiReady(midi),
            (err) => console.log('Something went wrong', err));

  }
}

</script>

<style scoped>

</style>