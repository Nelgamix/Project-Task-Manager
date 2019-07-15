import {InstanceType} from "typegoose";
import {Project, ProjectMetadata} from "../../schemas/Project";

const defaultMetadata: any[] = [
  {
    name: 'State',
    description: 'State of the ticket',
    values: [
      {
        name: 'Open',
        value: 0,
      },
      {
        name: 'In Progress',
        value: 1,
      },
      {
        name: 'Closed',
        value: 2,
      },
    ]
  },
];

export function updateMetadata(
    project: InstanceType<Project>,
    metadata: ProjectMetadata[],
    allowDefault = false
) {
  if (!metadata) {
    return false;
  } else if (allowDefault && defaultMetadata) {
    project.metadata = defaultMetadata;
    return false;
  }

  project.metadata = metadata;

  return true;
}
