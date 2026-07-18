# Visuals Recommendation

Yes, this project should include visuals in the GitHub description and README.

Visuals are especially useful here because the project has a real web interface and a simple data flow that can be explained quickly with screenshots. They will help recruiters, instructors, and collaborators understand the value of the project without cloning it first.

## Best Visuals To Add

1. **Dashboard screenshot**  
   Shows the logged-in user landing screen.

2. **Prediction form screenshot**  
   Shows event name, date, location, and the weather prediction button.

3. **Forecast result screenshot**  
   Shows the rain probability bar and recommendation.

4. **Event history screenshot**  
   Shows saved plans and past probabilities.

5. **Short demo GIF**  
   Shows the full flow: signup/login -> create event -> get forecast -> view history.

6. **Architecture diagram**  
   Recommended flow:

```text
Browser
  -> Django views/API
  -> OpenStreetMap Nominatim geocoding
  -> NASA POWER climate data
  -> Weighted probability calculation
  -> SQLite saved event history
```

## Where To Store Visuals

Create:

```text
docs/assets/
```

Suggested filenames:

```text
dashboard.png
forecast-form.png
forecast-result.png
event-history.png
demo.gif
architecture.png
```

Then link them from the README.
