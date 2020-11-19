import { useState } from "react";
import CustomHead from "../src/components/Head/head";
import useSWR from "swr";
import { fetcher } from "../utils/fetcher";
import BackDropWithSpinner from "../src/components/BackDropWithSpinner/backdrop-with-spinner.component";
import TwitterUserInfo from "../src/components/TwitterUserInfo/twitter-user-info.component";
import TweetCard from "../src/components/TweetCard/tweet-card.component";
import {
  Box,
  Typography,
  Grid,
  Divider,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
} from "@material-ui/core";

const Twitter = () => {
  const { data, error } = useSWR("/api/twitter", fetcher);
  const [sortType, setSortType] = useState("date");

  if (error) return <div>failed to load</div>;
  if (!data) return <BackDropWithSpinner open={true} />;
  if (!data.userData || !data.tweetsData) return <div>Error</div>;

  const sortArray = (type) => {
    const types = {
      date: "created_at",
      retweets: "retweet_count",
      likes: "favorite_count",
    };
    const sortProperty = types[type];
    const tweetsArr = data.tweetsData;
    if (type === "date") {
      return [...tweetsArr].sort(
        (a, b) => Date.parse(b[sortProperty]) - Date.parse(a[sortProperty])
      );
    } else {
      return [...tweetsArr].sort((a, b) => b[sortProperty] - a[sortProperty]);
    }
  };

  const renderTweets = () => {
    const sorted = sortArray(sortType);
    return (
      <Grid container spacing={2}>
        {sorted.map((tweet, id) => (
          <Grid item sm={6} key={id}>
            <TweetCard {...tweet} />
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <>
      <CustomHead title="Twitter stats" />
      <Box style={{ width: "100%" }}>
        <Typography variant="h2" align="center">
          {data.userData.name}
        </Typography>
        <Typography variant="h6" align="center" gutterBottom>
          {data.userData.description}
        </Typography>
        <TwitterUserInfo {...data.userData} />

        <Divider />

        <Box p={2}>
          <Typography variant="h2" align="center">
            Tweets
          </Typography>
        </Box>
        <FormControl component="fieldset">
          <FormLabel component="legend">Sorted by</FormLabel>
          <RadioGroup
            row
            aria-label="sort"
            name="sorted-articles"
            value={sortType}
            onChange={(event) => setSortType(event.target.value)}
          >
            <FormControlLabel
              value="date"
              control={<Radio />}
              label="Published Date"
            />
            <FormControlLabel
              value="retweets"
              control={<Radio />}
              label="Retweets"
            />
            <FormControlLabel value="likes" control={<Radio />} label="Likes" />
          </RadioGroup>
        </FormControl>
        {renderTweets()}
      </Box>
    </>
  );
};

export default Twitter;
