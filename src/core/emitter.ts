import { PropertyDetails, MethodDetails, HeritageClause } from "./interfaces";
import { templates } from "./templates";

export function emitSingleClass(
  name: string,
  properties: PropertyDetails[],
  methods: MethodDetails[],
  isAbstract: boolean
) {
  return templates.class(name, properties, methods, isAbstract);
}

export function emitSingleInterface(
  name: string,
  properties: PropertyDetails[],
  methods: MethodDetails[]
) {
  return templates.interface(name, properties, methods);
}

export function emitHeritageClauses(heritageClauses: HeritageClause[]) {
  return heritageClauses.map((heritageClause) =>
    templates.implementsOrExtends(
      heritageClause.clause,
      heritageClause.className
    )
  );
}
