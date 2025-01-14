import { suite } from "uvu";
import * as assert from "uvu/assert";
import { createRoot, createSignal } from "solid-js";
import { createEventListener, EventListenerProps } from "../src/index";

const test = suite("createEventListener");

test("it will add an event", () =>
  new Promise<void>(resolve =>
    createRoot(dispose => {
      const target = new EventTarget();
      const testEvent = new Event("test");
      createEventListener<{ test: Event }, EventTarget>(target, "test", ev => {
        assert.is(ev, testEvent);
        dispose();
        resolve();
      });
      target.dispatchEvent(testEvent);
    })
  ));

test("it will only add the event once", () =>
  new Promise<void>(resolve =>
    createRoot(dispose => {
      const target = new EventTarget();
      const testEvent = new Event("test");
      let count = 0;
      createEventListener<{ test: Event }, EventTarget>(target, "test", () => {
        count++;
      });
      target.dispatchEvent(testEvent);
      window.setTimeout(() => {
        assert.is(count, 1);
        dispose();
        resolve();
      }, 200);
    })
  ));

test("will add events to multiple targets", () =>
  new Promise<void>(resolve =>
    createRoot(dispose => {
      const targets = [new EventTarget(), new EventTarget()];
      const testEvent = new Event("test");
      let count = 0;
      createEventListener<{ test: Event }, EventTarget[]>(targets, "test", () => {
        count++;
      });
      targets.forEach(target => target.dispatchEvent(testEvent));
      window.setTimeout(() => {
        assert.is(count, 2);
        dispose();
        resolve();
      }, 200);
    })
  ));

test("will work as directive and update the event", () =>
  new Promise<void>(resolve =>
    createRoot(dispose => {
      const target = document.createElement("div");
      const testEvent = new Event("load");
      const [props, setProps] = createSignal<EventListenerProps<HTMLElement>>([
        "load",
        (ev: Event) => assert.is(ev, testEvent)
      ]);
      createEventListener(target, props);
      target.dispatchEvent(testEvent);
      window.setTimeout(() => {
        setProps(["load", () => (dispose(), resolve())]);
        target.dispatchEvent(testEvent);
      }, 10);
    })
  ));

test.run();
