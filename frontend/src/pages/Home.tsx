import React, {useEffect, useState} from 'react';
import {Person} from 'lincd-foaf/lib/shapes/Person';
import {PersonAvatar} from 'lincd-foaf/lib/components/PersonAvatar';
import {PersonProfileCard} from 'lincd-foaf/lib/components/PersonProfileCard';
import {JSONLD, JSONLDParseResult} from 'lincd-jsonld/lib/utils/JSONLD';
import {rdf} from 'lincd/lib/ontologies/rdf';
import {foaf} from 'lincd-foaf/lib/ontologies/foaf';
import {CodeView} from 'lincd-schema/lib/components/CodeView';
import {Code} from 'lincd-schema/lib/shapes/Code';
import './Home.scss';
import * as style from './Home.scss.json';

let parseData = fetch(
  'https://raw.githubusercontent.com/idafensp/idafensp.github.io/da79fb6c87978719daa94a50f97c555a4e993f91/foaf.jsonld',
)
  .then((r) => {
    if (r.ok) {
      return r.json();
    }
  })
  .catch((err) => {
    console.warn('Could not load data. ', err);
    return require('../../../data/copy-github-data.json');
  })
  .then((json) =>
    JSONLD.parse(json).then((parseResult) => {
      //nested promise for demo purpose to ensure we return both json + parse result
      return [json, parseResult] as [string, JSONLDParseResult];
    }),
  )
  .catch((err) => {
    console.warn('Could not parse json data. ', err);
    return require('../../../data/copy-github-data.json');
  });

let fetchPersonCode = `let jsonURL = 'https://raw.githubusercontent.com/idafensp/idafensp.github.io/da79fb6c87978719daa94a50f97c555a4e993f91/foaf.jsonld';
Person.fetchFrom(jsonURL).then(person => {
  setPerson(person);
})`;
let visualizePersonCode = `<PersonProfileCard of={person} />`;

let fullCode = `import React, {useEffect, useState} from 'react';
import {Person} from 'lincd-foaf/lib/shapes/Person';
import {PersonProfileCard} from 'lincd-foaf/lib/components/PersonProfileCard';

const dataURL = 'https://raw.githubusercontent.com/idafensp/idafensp.github.io/da79fb6c87978719daa94a50f97c555a4e993f91/foaf.jsonld';

export default function Demo() {
  let [person, setPerson] = useState<Person>();
  useEffect(() => {
    Person.fetchFrom(dataURL).then(person => {
      setPerson(person);
    })
  });
  return <PersonProfileCard of={person} />;
}
`;

export default function Home() {
  let [person, setPerson] = useState<Person>();
  let [json, setJSON] = useState<string>();
  useEffect(() => {
    // Person.fetchFrom('https://raw.githubusercontent.com/idafensp/idafensp.github.io/da79fb6c87978719daa94a50f97c555a4e993f91/foaf.jsonld').then(person => {
    //   setPerson(person);
    // })
    parseData.then(([json, parseResult]: [string, JSONLDParseResult]) => {
      setJSON(JSON.stringify(json, null, 2));
      let subject = parseResult.quads.getSubjects().find((s) => {
        return s.has(rdf.type, foaf.Person);
      });
      if (subject) {
        setPerson(new Person(subject));
      }
    });
  });
  return (
    <div className={style.Home + ' unreset'}>
      <h1>Visualising a FOAF profile with LINCD</h1>
      <ol>
        <li>
          Take an example FOAF profile in JSONLD, like{' '}
          <a
            href="https://github.com/idafensp/idafensp.github.io/blob/da79fb6c87978719daa94a50f97c555a4e993f91/foaf.jsonld"
            target={'_blank'}
          >
            this one
          </a>{' '}
          on github (first one I found)
          {/*<div className={style.codeBlock}>*/}
          {/*  {json ? <CodeView of={Code.fromValue(json)} language="json" /> : '...'}*/}
          {/*</div>*/}
        </li>
        <li>
          Since this document describes a{' '}
          <a href="http://xmlns.com/foaf/0.1/#term_Person" target={'_blank'}>
            foaf:Person
          </a>
          , fetch the JSONLD and retrieve the person described in it as an an instance of the{' '}
          <a href="https://www.lincd.org/browse/modules/lincd-foaf/shapes/Person" target={'_blank'}>
            Person
          </a>{' '}
          shape (from the lincd-foaf package)
          <CodeView
            className={style.codeBlock}
            lineNumbers={false}
            of={Code.fromValue(fetchPersonCode)}
            language="typescript"
          />
        </li>
        <li>
          Visualise this person with any of the matching components with 1 line of code:
          <CodeView
            className={style.codeBlock}
            lineNumbers={false}
            of={Code.fromValue(visualizePersonCode)}
            language="typescript"
          />
        </li>
        <li>
          The result:
          {person && <PersonProfileCard of={person} />}
        </li>
      </ol>
      <h4>Full code:</h4>
      <CodeView
        className={style.codeBlock + ' ' + style.fullCodeBlock}
        lineNumbers={false}
        of={Code.fromValue(fullCode)}
        language="typescript"
      />
    </div>
  );
}
