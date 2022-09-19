import { PropertyDetails, MethodDetails } from "./interfaces";

export const templates = {
  composition: "+->",
  implementsOrExtends: (abstraction: string, implementation: string) => {
    if (implementation === "default") {
      return "";
    }
    return (
      `\n${templates.plainClassOrInterface(abstraction)}` +
      ` <|-- ${templates.plainClassOrInterface(implementation)}\n`
    );
  },
  plainClassOrInterface: (name: string) => `${name}`,
  colorClass: (name: string) => `[${name}{bg:skyblue}]`,
  colorInterface: (name: string) => `[${name}{bg:palegreen}]`,
  class: (
    name: string,
    props: PropertyDetails[],
    methods: MethodDetails[],
    isAbstract: boolean
  ) => {
    const pTemplate = (property: PropertyDetails) =>
      `${name} : ${property.name};`;
    const mTemplate = (method: MethodDetails) => `${name} : ${method.name}();`;
    return (
      `${isAbstract ? `abstract ${name}\n` : ""}` +
      `${props.map(pTemplate).join("\n")}\n\n${methods
        .map(mTemplate)
        .join("\n")}`
    );
  },
  interface: (
    name: string,
    props: PropertyDetails[],
    methods: MethodDetails[]
  ) => {
    const pTemplate = (property: PropertyDetails) =>
      `${name} : ${property.name};`;
    const mTemplate = (method: MethodDetails) => `${name} : ${method.name}();`;
    return (
      // `${templates.colorInterface(name)}` +
      `${props.map(pTemplate).join("\n")}\n${methods.map(mTemplate).join("\n")}`
    );
  },
};
