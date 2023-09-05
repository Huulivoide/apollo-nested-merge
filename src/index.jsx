import { gql, InMemoryCache } from "@apollo/client";

const QUERY = gql`
    query Q {
        nested { # LevelA
            id
            children { # LevelB
                id
                child { # LevelC
                    id
                    children { # LevelD
                        id
                    }
                }
            }
        }
    }
`;

const logMergePolicy = {
  merge(e = null, i, { readField }) {
    console.log(`${readField('__typename', i)}.merge`, JSON.stringify({e, i}));
    debugger;
    return i;
  }
}

const cache = new InMemoryCache({
  typePolicies: {
    LevelA: logMergePolicy,
    LevelB: logMergePolicy,
    LevelC: logMergePolicy,
    LevelD: logMergePolicy
  }
});

cache.writeQuery({
  query: QUERY,
  data: {
    nested: {
      __typename: "LevelA",
      id: "A",
      children: [{
        __typename: "LevelB",
        id: "B",
        child: {
          __typename: "LevelC",
          id: "C",
          children: [{
            __typename: "LevelD",
            id: "D",
            child: null
          }]
        }
      }]
    }
  }
});

window.cache = cache;
