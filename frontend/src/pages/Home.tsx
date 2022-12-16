import {PersonAvatar} from 'lincd-foaf/lib/components/PersonAvatar';
import {Person} from 'lincd-foaf/lib/shapes/Person';
import {NamedNode} from 'lincd/lib/models';
import './Home.scss';
import * as style from './Home.scss.json';

let person = new Person();
person.name = 'Rene Verheij';
person.homepage = NamedNode.getOrCreate('https://github.com/flyon');

// let div = new DivComponent();
// let avatar  = new PersonAvatarShape();
// avatar.addStyle('border','2px solid gold');
// div.addChild(avatar);

/**
 * _:view rdf:type :Div
 * :avatar rdf:type :Avatar
 *
 * :avatar mynd:style [
 *    css:border "2px solid gold"
 * ]
 *
 * _:view mynd:child :avatar
 */

// let persons = [1,2,3,4,5,6,7];

export default function Home() {
  return (
    <div>
      {/*<PersonAvatar rootProps={className:{style.Avatar}} />*/}
      <PersonAvatar of={person} />
      {/*<PersonAvatar style={{border:'2px solid gold'}} />*/}
      {/*<PersonAvatar className={style.Avatar4} />*/}
      {/*<PersonAvatar className={style.Avatar5} />*/}
      {/*<PersonAvatar className={style.Avatar6} />*/}
      {/*<PersonAvatar className={style.Avatar7} />*/}
      {/*<PersonAvatar className={style.Avatar8} />*/}

      {/*<Grid of={persons} as={PersonAvatar} rootElementProps={{*/}
      {/*  style: {*/}
      {/*    borderColor: randomFn()*/}
      {/*  }*/}
      {/*}} />*/}

      {/*<Grid of={persons} render={(person) => <PersonAvatar />} />*/}
    </div>
  );
}
