import React from 'react';
import { useQuery, gql } from '@apollo/client';

import './App.css';
import { SearchBar } from './components/SearchBar';


const GET_USERS = gql`
  query users {
    users {
      id
      name    
    }
  }
`;

const GET_FEEDS = gql`
  query feeds {
    feeds {
      id
      name
      url    
    }
  }`

const GET_FEED_FOLLOWS = gql`
  query FeedFollows($id: String!) {
    feedFollows(userId: $id) {
      id
      user {
        id
        name
      }
      feed {
        id
        name
        url
      }
    }
  }`

const GET_POSTS = gql`
  query posts {
    posts {
      id
      title
      description
      publishedAt
      url  
    }
  }`


function App() {
  const [feedFollowUserSearch, setFeedFollowUserSearch] = React.useState("");
  const [showFeedFollowResults, setShowFeedFollowResults] = React.useState(false);
  const [feedFollowUserId, setFeedFollowUserId] = React.useState("");
  const [showEmptyResult, setShowEmptyResult] = React.useState(false);
  const [users, setUsers] = React.useState<Array<{ id: string, name: string }> | null>(null);

  function DisplayUsers() {
    const { loading, error, data } = useQuery(GET_USERS);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error : {error.message}</p>;
    setUsers(data.users);
    return data.users.map(({ id, name }: { id: string, name: string }) => (
      <div key={id}>
        <p>{name}</p>
      </div>
    ));
  }

  function DisplayFeeds() {
    const { loading, error, data } = useQuery(GET_FEEDS);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error : {error.message}</p>;

    return data.feeds.map(({ id, name, url }: { id: string, name: string, url: string }) => (
      <div key={id}>
        <a className="app-link" href={url}>{name}</a>
      </div>
    ));
  }

  function DisplayFeedFollows(props: { userId: string }) {

    const { loading, error, data } = useQuery(GET_FEED_FOLLOWS, { variables: { id: props.userId } });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error : {error.message}</p>;

    if (data.feedFollows.length === 0) {
      setShowEmptyResult(true);
      return;
    }

    return data.feedFollows.map(({ id, user, feed }: { id: string, user: { id: string, name: string }, feed: { id: string, name: string, url: string } }) => (
      <div key={id}>
        <p>User: {user.name} </p>
        <a className="app-link" href={feed.url}>{feed.name}</a>
      </div>
    ));
  }

  function getUserFeedFollows(userName: string) {
    if (!users) return;
    const user = users.find((user: { id: string, name: string }) => user.name === userName)
    if (user) {
      setFeedFollowUserId(user.id)
      setShowFeedFollowResults(true)
      return null;
    }
    setShowEmptyResult(true)
    return null;

  }

  function DisplayPosts() {

    const { loading, error, data } = useQuery(GET_POSTS);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error : {error.message}</p>;


    return data.posts.map(({ id,
      title,
      description,
      publishedAt,
      url }: {
        id: string,
        title: string,
        description: string,
        publishedAt: string,
        url: string,
      }) => (
      <div key={id}>
        <a className="app-link" href={url}>{title}</a>
        <small><p>Published: {publishedAt}</p></small>
        <p>{description}</p>
      </div>
    ));
  }

  return (
    <div className="app">
      <img src="https://go.dev/images/gophers/ladder.svg" alt="go-gopher" className="app-logo" />
      <div className="app-header">
        <h1 className="app-title">
          Go RSS Aggregator
        </h1>

        <p className="app-description">This is a project used to learn Go. Specifically a web server that exposes a GraphQL API, leveraging concurrent web scrapping to deliver the latest posts for each feed.</p>
      </div>

      <div className="app-body">
        <div className="row">
          <div className="column">
            <h2>Users</h2>
            <DisplayUsers />
          </div>

          <div className="column">
            <h2>Feeds</h2>
            <DisplayFeeds />
          </div>

          <div className="column">
            <h2>Feed Follows</h2>
            <p>Get feeds by user: </p>

            <SearchBar 
              value={feedFollowUserSearch} 
              onChange={e => { 
                setFeedFollowUserSearch(e.target.value); 
                setShowEmptyResult(false); 
                setShowFeedFollowResults(false); 
              }} 
              onSubmit={() => { getUserFeedFollows(feedFollowUserSearch) }}
              onClear={() => { setFeedFollowUserSearch(""); setShowEmptyResult(false); setShowFeedFollowResults(false); }}
              />

            {showFeedFollowResults && feedFollowUserId ? (
              <DisplayFeedFollows userId={feedFollowUserId} />
            ) : null}
            {showEmptyResult && <p>Oops, looks like this users is not following any feeds.</p>}
          </div>
        </div>

        <div className='row'>
          <div className="column">
            <div>
              <h2>Posts</h2>
              <DisplayPosts />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
