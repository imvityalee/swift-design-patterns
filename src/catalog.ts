import type { Pattern, Category } from "./types.js";

import { abstractFactory } from "./patterns/abstract-factory.js";
import { builder } from "./patterns/builder.js";
import { factoryMethod } from "./patterns/factory-method.js";
import { prototype } from "./patterns/prototype.js";
import { singleton } from "./patterns/singleton.js";

import { adapter } from "./patterns/adapter.js";
import { bridge } from "./patterns/bridge.js";
import { composite } from "./patterns/composite.js";
import { decorator } from "./patterns/decorator.js";
import { facade } from "./patterns/facade.js";
import { flyweight } from "./patterns/flyweight.js";
import { proxy } from "./patterns/proxy.js";

import { chainOfResponsibility } from "./patterns/chain-of-responsibility.js";
import { command } from "./patterns/command.js";
import { interpreter } from "./patterns/interpreter.js";
import { iterator } from "./patterns/iterator.js";
import { mediator } from "./patterns/mediator.js";
import { memento } from "./patterns/memento.js";
import { observer } from "./patterns/observer.js";
import { state } from "./patterns/state.js";
import { strategy } from "./patterns/strategy.js";
import { templateMethod } from "./patterns/template-method.js";
import { visitor } from "./patterns/visitor.js";

export const patterns: Pattern[] = [
  // Creational
  abstractFactory,
  builder,
  factoryMethod,
  prototype,
  singleton,
  // Structural
  adapter,
  bridge,
  composite,
  decorator,
  facade,
  flyweight,
  proxy,
  // Behavioral
  chainOfResponsibility,
  command,
  interpreter,
  iterator,
  mediator,
  memento,
  observer,
  state,
  strategy,
  templateMethod,
  visitor,
];

export const categories: Category[] = ["Creational", "Structural", "Behavioral"];

export const byId = new Map<string, Pattern>(patterns.map((p) => [p.id, p]));
